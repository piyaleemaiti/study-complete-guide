const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");
const mailSender = require("../util/email");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
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
  let message = req.flash("error");
  if (message.length > 0) {
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
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMsg: message,
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.redirect("/");
      }
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "Update Password",
        errorMsg: message,
        userId: user._id,
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email && password) {
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Invalid email or password");
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
          req.flash("error", "Invalid email or password");
          res.redirect("/login");
        });
      })
      .catch((err) => console.log(err));
  } else {
    req.flash("error", "Please provide email and password");
    res.redirect("/login");
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
          req.flash(
            "error",
            "E-Mail exists already, please pick a different one."
          );
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
            return mailSender.sendMail({
              to: email,
              from: "pmaiti@shop.com",
              subject: "Signup Succeeded!",
              html: "<h1>You successfully signed up!</h1>",
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  } else {
    req.flash("error", "Confirm password didn't match");
    res.redirect("/signup");
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found!");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        return mailSender.sendMail({
          to: req.body.email,
          from: "pmaiti@shop.com",
          subject: "Password Reset",
          html: `
            <p>You requested a password reset.</p>
            <p> Click the <a href="http://localhost:4000/reset/${token}">link to reset the password.</p>
          `,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.postNewPassword = (req, res, next) => {
  const password = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
    .then((user) => {
      if (!user) {
        return res.redirect("/");
      }
      return bcryptjs.hash(password, 12).then(hashPassword => {
        user.password = hashPassword;
        return user.save();
      })
      .then(result => {
        return res.redirect('/login');
      })
      .catch(err => console.log(err));
    })
    .catch((err) => console.log(err));
};
