const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
{
  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String
  },

  email: {
    type: String,
    lowercase: true
  },

  mobileNumber: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  onlineStatus: {
    type: Boolean,
    default: false
  },

  otp: {
    type: String,
    default: null
  },

  userType: {
    type: String,
    enum: ['A', 'U'], // A for Admin, U for User
    default: 'U'
  },

  userStatus: {
    type: String,
    enum: ['A', 'I', 'P'], // A for Active, I for Inactive, P for Pending
    default: 'P'
  },

  location: {
    type: String
  },

},
{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);