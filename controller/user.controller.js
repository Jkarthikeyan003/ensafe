const { Router } = require("express");
const userService = require("../service/user.service");

const router = Router();

router.post("/signup", (req, res) => {
  userService.signup(req)
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;