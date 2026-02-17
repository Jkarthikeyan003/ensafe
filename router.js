const express = require('express');
const app = express();


app.route('/user', require('./user/user.controller'));