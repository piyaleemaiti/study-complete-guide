const path = require("path");
const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controller/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter valid email address")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject(
              "The email address not exist. Please enter valid email address."
            );
          }
          req.user = user;
        });
      })
      .normalizeEmail(),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Please provide password")
      .trim(),
  ],
  authController.postLogin
);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .not()
      .isEmpty()
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please provide confirm password.")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords didn't match!");
        }
        return true;
      }),
  ],
  authController.postSignup
);
router.post("/logout", authController.postLogout);
router.post("/reset", authController.postReset);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
