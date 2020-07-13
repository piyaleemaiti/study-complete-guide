const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  });
};

exports.loginUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadUser;
  User.findOne({email: email})
    .then((user) => {
      if (!user) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        throw error;
      }
      loadUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error("Password didn't match!");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign({
        userId: loadUser._id,
        email: loadUser.email,
        password: loadUser.password
      }, "secretPassPilu", { expiresIn: "1h" });
      res.status(200).json({message: "Login successfull!", token, userId: loadUser._id });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
};

exports.getUserstatus = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("No user found!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({message: "User details", status: user.status });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
};

exports.updateUserStatus = (req, res, next) => {
  const status = req.body.status;
  console.log('status', status);
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("No user found!");
        error.statusCode = 404;
        throw error;
      }
      user.status = status;
      return user.save();
    })
    .then(result => {
      console.log('result', result);
      res.status(200).json({message: "Status updated", status: result.status });
    })
    .catch(err => {
      if(!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    })
};
