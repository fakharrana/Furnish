require("dotenv").config(); //For environment variables

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("./model/User");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

//Defining passport local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    User.authenticate()
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Define passport jwt strategy
var options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.SECRET_KEY;
passport.use(
  new JwtStrategy(options, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload._id }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done({ Message: "User Not Registered" }, false);
        // or you could create a new account
      }
    });
  })
);

//Exporting Method for User Verification
exports.verifyUser = passport.authenticate("jwt", { session: false });

//Exporting Method for User Access Token
exports.getToken = function (user) {
  return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "24h" });
};

//Exporting Method for Admin Verification
exports.verifyAdmin = function (req, res, next) {
  User.findOne({ _id: req.user._id }, function (err, user) {
    if (err) {
      return next(err);
    } else if (user.admin) {
      return next();
    } else {
      return res
        .status(401)
        .json({ Error: "You are not allowed to perform this operation" });
    }
  });
};
