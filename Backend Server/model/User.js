var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

//Creating User Schema
var User = new Schema({
  name: {
    type: String,
    default: "Customer",
  },
  role: {
    type: String,
    default: "Customer",
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

//Using Passport Local Mongoose Plugin
User.plugin(passportLocalMongoose, { usernameField: "email" });

//Exporting User Model
module.exports = mongoose.model("User", User);
