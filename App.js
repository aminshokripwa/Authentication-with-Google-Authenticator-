const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./config/passport')(passport);
const { authenticator } = require('otplib')
const flash = require('express-flash-messages');
const app = express();
const methodOverride = require('method-override');
const User = require("./models/index")["User"];

//roots js files

const { getHomePage } = require('./routes/index');
const { postLogin, getLogin, handleLogout } = require('./routes/login');
const { twoFactorAuthentication } = require('./routes/login-2fa');
const { getGoogleLogin, handleGoogleLogin } = require('./routes/google_login');
const { getRegister, submitRegister } = require('./routes/register');

//database information in .env file

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('connected to database');
});
global.db = db;

//used packages

app.set('port', process.env.PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'aminpshokripwa',
    saveUninitialized: true,
    resave: true
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'))

//Two-Factor Authentication page

app.get('/', getHomePage);

//Two-Factor Authentication method

app.post('/', (req, res) => {
    if (!req.user) {
        console.log('POST user not found');
        return res.redirect('/')
    }
    const email = req.user.email, secrect = req.user.secrect_token , code = req.body.code
    return verifyLogin(email, secrect, code, req, res, '/?unverified')
  })

 //generate new secret code

app.put('/', (req, res) => {
    if (!req.user) {
        console.log('PUT user not found');
        return res.redirect('/')
    }
    const email = req.user.email
    return newsecrect(email, req, res)
  })

//normal login

app.post('/login', postLogin);
app.get('/login', getLogin);

app.get('/logout', handleLogout);

//normal register

app.get('/register', getRegister);
app.post('/register', submitRegister);

//login by google

app.get('/auth/google', getGoogleLogin);
app.get('/auth/google/callback', handleGoogleLogin);

//Two-Factor Authentication Login

app.get('/login-2fa', twoFactorAuthentication);
app.post('/login-2fa', (req, res) => {
    const email = req.body.email,code = req.body.code
    return verifyLogin(email, null, code, req, res, '/login-2fa?unverified')
})

//fast login by secrect code or verfy secret code

async function verifyLogin (email, secrect, code, req, res, failUrl) {
    const user = await User.findOne({ where: { email: email } });
    if (user === null) {
        console.log('user not found');
        return res.redirect(failUrl)
    }
    if (!authenticator.check(code, user.secrect_token)) {

        //redirect back

        console.log('user not verified');
        return res.redirect(failUrl)
      }

      //add user session

      req.login(user, function(err) {
        if (err) return next(err)
      });

      //redirect to "main" page

      return res.redirect('/?verified')
  }

  //generate new secret code

  async function newsecrect (email, req, res) {
    const newtoken = authenticator.generateSecret();
    await User.update({ secrect_token:newtoken },{ where: { email: email }});
    user = req.user ; user.secrect_token = newtoken ;

    //add new token to user session

    req.login(user, function(err) {
      if (err) return next(err)
    });

      //redirect to "main" page

      return res.redirect('/')
  }

app.listen(process.env.PORT, () => {
    console.log(`server running on port: ${process.env.PORT}`);
});
