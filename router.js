const express = require('express');
const router = express.Router();

// mount controller
router.use('/users', require('./controller/user.controller'));
router.use('/jobs', require('./controller/job.controller'));

module.exports = router;