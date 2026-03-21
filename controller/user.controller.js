const { Router } = require("express");
const userService = require("../service/user.service");

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

module.exports = router;