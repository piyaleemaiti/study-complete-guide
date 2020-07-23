const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const headerAuthorization = req.get("Authorization");
  if (!headerAuthorization) {
    req.isAuth = false;
    return next();
  }
  const token = headerAuthorization.split(" ")[1];
  let validateToken;
  try {
    validateToken = jwt.verify(token, 'secretPassPilu');
  } catch(err) {
    req.isAuth = false;
    return next();
  }
  if (!validateToken) {
    req.isAuth = false;
    return next();
  }
  req.userId = validateToken.userId;
  req.isAuth = true;
  next();
};