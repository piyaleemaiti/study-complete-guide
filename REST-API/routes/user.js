const express = require("express");
const { body } = require("express-validator");

const User = require("../modals/user");
const userController = require("../controllers/user");
const isAuth = require('../moddleware/isAuth');

const router = express.Router();

// GET /feed/posts
router.put(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid email address")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("E-Mail address is already exist.");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  userController.signupUser
);

router.post("/login", userController.loginUser);
router.get("/status", isAuth, userController.getUserstatus);
router.patch("/status", isAuth, userController.updateUserStatus);

module.exports = router;
