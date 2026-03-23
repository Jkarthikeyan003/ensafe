const bcrypt = require('bcrypt');
const User = require("../model/user.model");
const { generateToken } = require("../commonFunction");
const md5 = require('md5');
const { sendOtpEmail, sendSignupSuccessEmail, sendApprovalEmail } = require('../commonFunction');
const { mongoose } = require('mongoose');


// ✅ SIGNUP
const signup = async (req) => {
  const { email, mobileNumber, password, location } = req.body;

  // Check existing user
  const existingUser = await User.findOne({
    $or: [{ email }, { mobileNumber }]
  });

  if (existingUser) {
    throw { status: 409, message: "User already exists with this email or mobile number" };
  }



  const user = await User.create({
    ...req.body,
    password: md5(password), // Hash password using MD5,
  });

    // 📧 SEND EMAIL (don't block response if fails)
  sendSignupSuccessEmail(user.email)
    .then(() => console.log("Signup email sent"))
    .catch(err => console.log("Email error:", err.message));

  return {...user.toJSON(), message: "Signup successful, pending admin approval. Kindly wait for confirmation email."};
};


// ✅ LOGIN
const login = async (req) => {
  const { email, mobileNumber, password } = req.body;

  if (!email && !mobileNumber) {
    throw { status: 400, message: "Email or mobile number is required" };
  }

  // Find user
  const user = await User.findOne({
    $or: [{ email }, { mobileNumber }]
  });

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  // Compare password
  const isMatch = md5(password) == user.password; // Compare hashed password

  if (!isMatch) {
    throw { status: 401, message: "Invalid credentials" };
  }

  // 🚫 STATUS VALIDATION
  if (user.userStatus === 'P') {
    throw new Error("User needs admin approval to login");
  }

  if (user.userStatus === 'I') {
    throw new Error("User is inactive. Contact admin");
  }

  // ✅ Only Active users allowed
  if (user.userStatus !== 'A') {
    throw new Error("User not allowed to login");
  }

  // Generate JWT
  const token = generateToken({
    userId: user._id,
    email: user.email,
    userType: user.userType
  });

  return {
    message: "Login successful",
    token,
    ...user.toJSON() // Return user data without password
  };
};

// ✅ 1. FORGOT PASSWORD
const forgotPassword = async (req) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp.toString();
  user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins

  await user.save();

  await sendOtpEmail(email, otp);

  return { message: "OTP sent to email" };
};


// ✅ 2. VALIDATE OTP
const validateOtp = async (req) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp) {
    throw { status: 400, message: "Invalid OTP" };
  }

  if (user.otpExpiry < Date.now()) {
    throw { status: 400, message: "OTP expired" };
  }

  return { message: "OTP verified successfully", userId: user._id };
};


// ✅ 3. CHANGE PASSWORD
const changePassword = async (req) => {
  const { _id, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw { status: 400, message: "Passwords do not match" };
  }

  const user = await User.findById(_id);

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  user.password = md5(password); // Hash new password using MD5
  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  return { message: "Password updated successfully" };
};

const getUsers = async (queryParams, userId) => {
  const { city, state, country, limit = 10, skip = 0, userStatus } = queryParams;

  const filter = {
    _id: { $ne: new mongoose.Types.ObjectId(userId) } // 👈 exclude logged-in user
  };

  // 🔍 Location filters
  if (city) filter["location"] = { $regex: city, $options: "i" };
  if (userStatus) filter["userStatus"] = userStatus;
  // if (state) filter["location.state"] = { $regex: state, $options: "i" };
  // if (country) filter["location.country"] = { $regex: country, $options: "i" };

  // (optional) only active users
  // filter.userStatus = "A";

  const project = {
    firstName: 1,
    lastName: 1,
    mobileNumber: 1,
    email: 1,
    location: 1,
    userStatus: 1
  };

  console.log("Filter:", filter);
  const users = await User.find(filter, project)
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  return {
    total,
    limit: Number(limit),
    skip: Number(skip),
    count: users.length,
    users
  };
};

// ✅ ADMIN APPROVE USER
const approveUser = async (user, id) => {
  // 🔐 Only ADMIN
  if (user.userType !== 'A') {
    throw { status: 403, message: "Only admin can approve users" };
  }

  const userInfo = await User.findById(id);

  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  if (user.userStatus === 'A') {
    throw { status: 400, message: "User already approved" };
  }

  // ✅ Update status
  userInfo.userStatus = 'A';
  await userInfo.save();

  // 📧 Send email (non-blocking)
  sendApprovalEmail(userInfo.email)
    .then(() => console.log("Approval email sent"))
    .catch(err => console.log("Email error:", err.message));

  return {
    message: "User approved successfully",
    user: userInfo.toJSON()
  };
};


module.exports = {
  signup,
  login,
  forgotPassword,
  validateOtp,
  changePassword,
  getUsers,
  approveUser
};