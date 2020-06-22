const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const router = express.Router();
const users = [];

router.get('/', (req, res, next) => {
  res.render('main', { pageTitle: 'Add User'});
});
router.post('/add-user', (req, res, next) => {
  users.push({name: req.body.name});
  res.redirect('/users');
});

exports.router = router;
exports.users = users;
