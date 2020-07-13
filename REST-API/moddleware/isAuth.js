const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const headerAuthorization = req.get("Authorization");
  if (!headerAuthorization) {
    const error = new Error("Not authenticated!")
    error.statusCode = 401;
    throw error;
  }
  const token = headerAuthorization.split(" ")[1];
  if (!token) {
    const error = new Error("Not authenticated!")
    error.statusCode = 401;
    throw error;
  }
  let validateToken;
  try {
    validateToken = jwt.verify(token, 'secretPassPilu');
  } catch(err) {
    err.statusCode = 500;
    throw err;
  }
  if (!validateToken) {
    const error = new Error("Not authenticated!")
    error.statusCode = 401;
    throw error;
  }
  req.userId = validateToken.userId;
  next();
};