const { default: mongoose } = require('mongoose');
const Job = require('../model/job.model');

// ✅ CREATE JOB
const createJob = async (req) => {
  const job = await Job.create({
    ...req.body,
    createdBy: new mongoose.Types.ObjectId(req.user._id) // from token
  });

  return job;
};

// ✅ UPDATE JOB
const updateJob = async (req) => {
  const { id } = req.params;

  const job = await Job.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  if (!job) {
    throw { status: 404, message: "Job not found" };
  }

  return job;
};

// ✅ DELETE JOB
const deleteJob = async (req) => {
  const { id } = req.params;

  const job = await Job.findByIdAndDelete(id);

  if (!job) {
    throw { status: 404, message: "Job not found" };
  }

  return { message: "Job deleted successfully" };
};

// ✅ GET JOB DETAIL
const getJobById = async (req) => {
  const { id } = req.params;

  const job = await Job.findById(id).populate('createdBy', 'email');

  if (!job) {
    throw { status: 404, message: "Job not found" };
  }

  return job;
};

// ✅ LIST JOBS (with pagination)
const listJobs = async (user, query) => {
  const { limit = 10, skip = 0 } = query;
  const match = {};
  if(user.userType !== 'U') {
    match.createdBy = new mongoose.Types.ObjectId(user.userId);
  }
  const jobs = await Job.find(match)
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Job.countDocuments();

  return {
    total,
    count: jobs.length,
    limit: Number(limit),
    skip: Number(skip),
    jobs
  };
};

module.exports = {
  createJob,
  updateJob,
  deleteJob,
  getJobById,
  listJobs
};