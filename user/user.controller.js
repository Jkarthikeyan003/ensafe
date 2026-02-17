const { Router } = require("express");
const userService = require("./user.service");

Router.get("/login", (req, res) => {
  userService.login(req).then(user => {
    res.json(user);
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

module.exports = Router;