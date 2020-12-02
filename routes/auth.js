const express = require("express");
const bycrypt = require("bcryptjs");
const User = require("../models/user");

const authController = require("../controllers/auth");

const { body } = require("express-validator");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email", "please enter an invalid email").isEmail(),

    body("password")
      .isLength({ min: 4 })
      .withMessage("the password must have at least 4 charecters")
      .isLength({ max: 8 })
      .withMessage("the password must not have more than 8 charecters"),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    body("email", "please enter the valid email address")
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("this email elready exists");
          }
        });
      }),
    body("password", "please enter the valid password")
      .isLength({ min: 4, max: 8 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw "this passwords does not match";
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
