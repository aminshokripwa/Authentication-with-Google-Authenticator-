module.exports = {

  twoFactorAuthentication: (req, res) => {
    var isLoginFailed = typeof req.query.unverified !== "undefined";
    if (isLoginFailed) {
      req.flash("validation_errors", [{ msg: "Login has failed." }]);
    }

    if ( req.user ) {
      return res.redirect("/");
    }

    res.render("login-2fa.ejs", {
      user: req.user
    });
  }
  
};
