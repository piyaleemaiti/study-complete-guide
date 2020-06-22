const express = require('express');
const path = require('path');
const rootDir = require('../util/path');
const mainData = require('./main');

const router = express.Router();

router.get('/users', (req, res, next) => {
  const users = mainData.users;
  res.render('user', { pageTitle: 'Users', users: users });
});

module.exports = router;