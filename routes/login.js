const passport = require("passport");

module.exports = {

  //login page
  getLogin: (req, res) => {
    var isLoginFailed = typeof req.query.login_failed !== "undefined";
    if (isLoginFailed) {
      req.flash("validation_errors", [{ msg: "Login has failed." }]);
    }

    if ( req.user ) {
      return res.redirect("/");
    }

    res.render("login.ejs", {
      user: req.user,
    });
  },

  //login method

  postLogin: [
    passport.authenticate("local", { failureRedirect: "/login?login_failed" }),
    (req, res) => {
      res.redirect("/");
    },
  ],

  //logout method

  handleLogout: (req, res) => {
    req.logout();
    res.redirect("/");
  }
  
};
