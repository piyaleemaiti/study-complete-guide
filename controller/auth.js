const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  console.log(req.session.user);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticate: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("5eeb27ba7b28521e866884ea")
  .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = new User(user);
      res.redirect('/');
    })
    .catch((err) => console.log(err));
}
