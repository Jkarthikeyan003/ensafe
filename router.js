const express = require('express');
const app = express();


app.route('/user', require('./controller/user.controller'));

module.exports = app;