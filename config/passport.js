const User = require("../models/index")["User"];
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const dotenvConfig = require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { authenticator } = require('otplib');
//
//
//  PASSPORT CONFIG
//
//
module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    //console.log("serializing " + user.username);
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    //console.log("deserializing  " + user.username);
    done(null, user);
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: true,
      },
      async function (username, password, done) {
        console.log(`trying to log in as ${username}`);
        const user = await User.findOne({ where: { email: username } });
        if (!user) {
          return done(null, false);
        }
        bcrypt.compare(password, user.password, function (err, res) {
          if (res) {
            console.log("successful login");
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_APP_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, cb) {
        //console.log(profile);
        const [user, status] = await User.findOrCreate({
          where: {
            email: profile.emails[0].value
          },
          defaults: {
            name: profile.name.givenName,
            family: profile.name.familyName,
            username: profile.id,
            secrect_token: authenticator.generateSecret(),
            imageUrl: profile.photos[0].value,
            registration_type: "google",
          }
        });
        cb(null, user);
      }
    )
  );
};
