const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'DONE'],
    default: 'OPEN'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);