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
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);