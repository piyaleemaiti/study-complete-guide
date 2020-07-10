const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../modals/user");

exports.signupUser = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    console.log('error.data', errors.array());
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  bcrypt.hash(password, 12).then(hashPasw => {
    const user = new User({
      name,
      email,
      password: hashPasw,
    });
    return user.save();
  })
  .then(result => {
    res.status(201).json({ message: "User created", userId: result._id });
  })
  .catch(err => {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })
};

