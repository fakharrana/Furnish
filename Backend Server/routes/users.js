var express = require("express");
var router = express.Router();
var controller = require("../controller/User");
var passport = require("passport");
const authentication = require("../authentication");

// GET users list
router.get(
  "/",
  authentication.verifyUser,
  authentication.verifyAdmin,
  controller.getAllUsers
);

//Signup
router.post("/signup", controller.signUp);

//login
router.post("/login", passport.authenticate("local"), controller.logIn);

//changename
router.put("/changename", authentication.verifyUser, controller.changeName);

//changepassword
router.put(
  "/changepassword",
  authentication.verifyUser,
  controller.changePassword
);

//Forgotpassword
router.put("/forgotpassword", controller.forgotPassword);

//Delete a user
router.delete(
  "/:id",
  authentication.verifyUser,
  authentication.verifyAdmin,
  controller.deleteUser
);

module.exports = router;
