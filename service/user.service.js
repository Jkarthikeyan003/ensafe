const bcrypt = require('bcrypt');
const User = require("../model/user.model");
const { generateToken } = require("../commonFunction");
const md5 = require('md5');

// ✅ SIGNUP
const signup = async (req) => {
  const { email, mobileNumber, password } = req.body;

  // Check existing user
  const existingUser = await User.findOne({
    $or: [{ email }, { mobileNumber }]
  });

  if (existingUser) {
    throw { status: 409, message: "User already exists with this email or mobile number" };
  }


  const user = await User.create({
    ...req.body,
    password: md5(password) // Hash password using MD5
  });

  return user;
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

  // Generate JWT
  const token = generateToken({
    id: user._id,
    email: user.email
  });

  return {
    message: "Login successful",
    token,
    ...user.toJSON() // Return user data without password
  };
};

module.exports = {
  signup,
  login
};