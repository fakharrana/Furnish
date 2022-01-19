require("dotenv").config();
const passport = require("passport");
const authentication = require("../authentication");
const User = require("../model/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

//Get All Users
module.exports.getAllUsers = function (req, res, next) {
  User.find({ admin: false }, function (err, user) {
    if (err) {
      return res.json({ Error: err });
    } else {
      return res.json(user);
    }
  });
};

//Signup
module.exports.signUp = function (req, res, next) {
  User.register(
    new User({ email: req.body.email }),
    req.body.password,
    function (err, user) {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        if (req.body.name) user.name = req.body.name;
        if (req.body.role) user.role = req.body.role;
        user.save(function (err, saveduser) {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
            return;
          }
          var token = authentication.getToken({ _id: user._id });
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({
              success: true,
              status: "Registration Successful!",
              token: token,
              user: user,
            });
          });
        });
      }
    }
  );
};

//Login
module.exports.logIn = function (req, res) {
  var token = authentication.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!",
    user: req.user, //Object containing user info
  });
};

//Change Name
module.exports.changeName = function (req, res) {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
    },
    function (err, user) {
      if (err) {
        return res.json(err);
      } else {
        return res.json({ Success: "Name Successfully Changed" });
      }
    }
  );
};

//Change Password
module.exports.changePassword = function (req, res) {
  req.user.changePassword(
    req.body.oldPassword,
    req.body.newPassword,
    function (err, user) {
      if (err) {
        return res.json(err);
      } else {
        return res.json({ Success: "Password Successfully Changed" });
      }
    }
  );
};

//Forgot Password
// Object for transportation of the mail
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

//Forgotpassword
module.exports.forgotPassword = function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      return res.json({ Error: "Unable to reset password, please try again" });
    }
    if (!user) {
      return res.json({ Error: "User not found" });
    } else {
      let temporaryPassword = crypto.randomBytes(14).toString("hex"); //temporary password

      user.setPassword(temporaryPassword, function (err, user) {
        if (err) {
          return res.json({
            Error: "Unable to reset password, please try again",
          });
        } else {
          user.save(function (err, user) {
            if (err) {
              return res.json({
                Error: "Unable to reset password, please try again",
              });
            }

            // All details of the mail
            let mailOptions = {
              from: "furnishstoree@gmail.com",
              to: req.body.email,
              subject: "Password Reset Request",
              html: `<p> Your temporary password is: <h3>${temporaryPassword}</h3> Kindly change your password</p>`,
            };

            // Sending mail to the user
            transporter.sendMail(mailOptions, (err, data) => {
              if (err) {
                return res.json({
                  Error: "Failed to send email, please try again",
                });
              }
              return res.json({
                Success: "Password successfully reset, kindly check your email",
              });
            });
          });
        }
      });
    }
  });
};

//Delete a User
module.exports.deleteUser = function (req, res) {
  User.deleteOne({ _id: req.params.id }, function (error) {
    if (error) {
      return res.json({ Error: "Error" });
    } else {
      return res.json({ Success: "Successfully Deleted" });
    }
  });
};
