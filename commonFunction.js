const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ✅ DB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// ✅ Generate Token
const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

// ✅ Verify Token Middleware
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // attach user info
    next();

  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

// ✅ Email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // IMPORTANT
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Transporter error:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});

const sendSignupSuccessEmail = async (to) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Signup Successful - Awaiting Approval",
    html: `
      <h2>Welcome to Ensafe 🎉</h2>
      <p>Your signup was successful.</p>
      <p><b>Note:</b> Your account is currently pending admin approval.</p>
      <p>You will be able to login once approved.</p>
      <br/>
      <p>Thanks,<br/>Ensafe Team</p>
    `
  });
};

// ✅ Send OTP Email
const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Reset OTP',
    html: `<h3>Your OTP is: ${otp}</h3>`
  });
};

const sendApprovalEmail = async (to) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Account Approved ✅",
    html: `
      <h2>Welcome to Ensafe 🎉</h2>
      <p>Your account has been <b>approved by admin</b>.</p>
      <p>You can now login and use the platform.</p>
      <br/>
      <p>Thanks,<br/>Ensafe Team</p>
    `
  });
};

module.exports = {
  connectDB,
  generateToken,
  verifyToken,
  sendOtpEmail,
  sendSignupSuccessEmail,
  sendApprovalEmail
};