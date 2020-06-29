exports.get404 = (req, res, next) => {
  res
    .status(404)
    .render("404", {
      pageTitle: "Page Not Found",
      path: "/404",
      isAuthenticate: req.loggedIn,
    });
};

exports.get500 = (req, res, next) => {
  res
    .status(500)
    .render("500", {
      pageTitle: "Page Not Found",
      path: "/500",
      isAuthenticate: req.loggedIn,
    });
};
