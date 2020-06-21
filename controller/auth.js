const bcryptjs = require("bcryptjs");
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require("../models/user");

const transport = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '',
  }
}));

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMsg: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMsg: message,
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMsg: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email && password) {
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'Invalid email or password');
          return res.redirect("/login");
        }
        bcryptjs.compare(password, user.password).then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash('error', 'Invalid email or password');
          res.redirect('/login');
        });
      })
      .catch((err) => console.log(err));
  } else {
    req.flash('error', 'Please provide email and password');
    res.redirect('/login');
  }
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password === confirmPassword) {
    User.findOne({ email: email })
      .then((userOld) => {
        if (userOld) {
          req.flash('error', 'E-Mail exists already, please pick a different one.');
          return res.redirect("/signup");
        }
        return bcryptjs
          .hash(password, 12)
          .then((hashPassword) => {
            const user = new User({
              email: email,
              password: hashPassword,
              cart: {
                items: [],
              },
            });
            return user.save();
          })
          .then((user) => {
            res.redirect("/login");
            return transport.sendMail({
              to: email,
              from: 'pmaiti@shop.com',
              subject: 'Signup Succeeded!',
              html: '<h1>You successfully signed up!</h1>'
            });
          })
          .catch(err => console.log(err));
      })
      .catch((err) => console.log(err));
  } else {
    req.flash('error', 'Confirm password didn\'t match');
    res.redirect('/signup');
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
