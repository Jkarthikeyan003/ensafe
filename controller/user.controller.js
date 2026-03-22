const { Router } = require("express");
const userService = require("../service/user.service");
const { verifyToken } = require("../commonFunction");
const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const user = await userService.signup(req);
    res.status(201).json(user);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const result = await userService.login(req);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const result = await userService.forgotPassword(req);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Validate OTP
router.post('/validate-otp', async (req, res) => {
  try {
    const result = await userService.validateOtp(req);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Change Password
router.post('/change-password', async (req, res) => {
  try {
    const result = await userService.changePassword(req);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.get("/list", verifyToken, async (req, res) => {
  try {
    const data = await userService.getUsers(
      req.query,
      req.user.userId // 👈 from token
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/approve/:id', verifyToken, async (req, res) => {
  try {
    const result = await userService.approveUser(req.user, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;