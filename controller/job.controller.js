const express = require('express');
const router = express.Router();

const jobService = require('../service/job.service');
const { verifyToken } = require('../commonFunction');

// ✅ CREATE JOB
router.post('/', verifyToken, async (req, res) => {
  try {
    const job = await jobService.createJob(req);
    res.status(201).json(job);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ✅ UPDATE JOB
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const job = await jobService.updateJob(req);
    res.json(job);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ✅ DELETE JOB
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await jobService.deleteJob(req);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ✅ GET JOB DETAIL
router.get('/:id', async (req, res) => {
  try {
    const job = await jobService.getJobById(req);
    res.json(job);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ✅ LIST JOBS
router.get('/', verifyToken,  async (req, res) => {
  try {
    const jobs = await jobService.listJobs(req.user,req.query);
    res.json(jobs);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;