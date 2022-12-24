
const QRCode = require('qrcode');
const { authenticator } = require('otplib');

let url = null;

module.exports = {

  getHomePage: (req, res) => {
    //console.log(req.user);
    var isverfiedsuccess = typeof req.query.verified !== "undefined";
    if (isverfiedsuccess) {
      req.flash("verify_success", [{ msg: "verify was succeeded." }]);
    }

    var isLoginFailed = typeof req.query.unverified !== "undefined";
    if (isLoginFailed) {
      req.flash("validation_errors", [{ msg: "verify was unsucceeded." }]);
    }

    if(req.user){

      //if logged show qrc

       QRCode.toDataURL(authenticator.keyuri(req.user.email, 'Authentication App', req.user.secrect_token), (err, url) => {
          if (err) {
            throw err
          }
          res.render("index.ejs", {
            qr: url,
            user: req.user,
          });
        })
    }else{

    //if not logged show login or register keys

      res.render("index.ejs", {
        qr: url,
        user: req.user,
        page_name : 'home',
      });
    }

  }
  
};
