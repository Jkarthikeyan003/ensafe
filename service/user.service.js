const md5 = require("md5");
const User = require("../model/user.model");

exports.signup = async (req) => {

  const { firstName, lastName, email, mobileNumber, password } = req.body;

  const existingUser = await User.findOne({ mobileNumber });

  if (existingUser) {
    throw new Error("User already exists with this mobile number");
  }

  const encryptedPassword = md5(password);

  const user = new User({
    firstName,
    lastName,
    email,
    mobileNumber,
    password: encryptedPassword
  });

  const savedUser = await user.save();

  return {
    message: "Signup successful",
    user: savedUser
  };
};