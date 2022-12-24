const { body, check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../models/index")["User"];
const passport = require("passport");
const { authenticator } = require('otplib');

module.exports = {
  //Register page
  getRegister: (req, res) => {

    if ( req.user ) {
      return res.redirect("/");
    }

    res.render("register.ejs", {
      user: req.user,
      userData: [],
    });

  },
  //Register method
  submitRegister: [
    [
      check("name").isLength({ min: 2 }).withMessage("name must be at least 2 chars long."),
      check("family").isLength({ min: 2 }).withMessage("family must be at least 2 chars long."),
      check("username").isLength({ min: 2 }).withMessage("Username must be at least 2 chars long."),
      body("username").custom((value) => {
        return User.findOne({ where: { username: value } }).then(
          (existingUser) => {
            if (existingUser) {
              return Promise.reject("username is already in use.");
            }
          }
        );
      }),
      check("email").isEmail().withMessage("Email must contain valid address."),
      body("email").custom((value) => {
        return User.findOne({ where: { email: value } }).then(
          (existingUser) => {
            if (existingUser) {
              return Promise.reject("E-mail is already in use.");
            }
          }
        );
      }),
      check("password").isLength({ min: 5 }).withMessage("Password must be at least 5 chars long."),
    ],
    async (req, res, next) => {
      const userData = req.body;
      const errors = validationResult(req);
      //
      if (!errors.isEmpty()) {
        req.flash("validation_errors", errors.array());
        return res.render("register.ejs", {
          user: req.user,
          userData: userData,
        });
      }
      //
      let name = req.body.name;
      let family = req.body.family;
      let username = req.body.username;
      let email = req.body.email;
      let secrect_token = authenticator.generateSecret();
      let password = req.body.password;

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name: name,
        family: family,
        username: username,
        email: email,
        secrect_token: secrect_token,
        registration_type: "email",
        password: hash,
      });
      console.log("created user is " + user.name);           
      passport.authenticate("local", function (err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect("/login");
        }
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.redirect("/");
        });
      })(req, res, next);
    },
  ]

};
