const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../modals/user");
// user controller
exports.signupUser = async (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  try {
    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashPassword,
    });
    const saveUser = await user.save();
    res.status(201).json({ message: "User created", userId: saveUser._id });
  }
  catch(err) {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
};

exports.loginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({email: email})
    if (!user) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password didn't match!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({
      userId: user._id,
      email: user.email,
      password: user.password
    }, "secretPassPilu", { expiresIn: "1h" });
    res.status(200).json({message: "Login successfull!", token, userId: user._id });
  }
  catch(err) {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
};

exports.getUserstatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("No user found!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({message: "User details", status: user.status });
  }
  catch(err) {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
};

exports.updateUserStatus = async(req, res, next) => {
  const status = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("No user found!");
      error.statusCode = 404;
      throw error;
    }
    user.status = status;
    const saveUser = await user.save();
    res.status(200).json({message: "Status updated", status: saveUser.status });
  }
  catch(err) {
    if(!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  };
};
