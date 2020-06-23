const path = require("path");
const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controller/auth");

const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/login", authController.postLogin);
router.post(
  "/signup",
  [
    check('email')
      .isEmail().withMessage('Please enter a valid email.')
      .custom(async (value, { req }) => {
        // let user = await User.findOne({ email: value });
        // console.log('user', user);
        // if (user) {
        //   throw new Error('E-mail already in use');
        // }
        return true;
      }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
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
