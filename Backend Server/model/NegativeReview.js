var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var utc = new Date();
var currentDate = utc.setHours(utc.getHours() + 5);

//Creating NegativeReview Schema
var NegativeReviewSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  review: { type: String, required: true },
  dateAnalyzed: { type: Date, default: currentDate },
});

//Exporting NegativeReview Model
module.exports = mongoose.model("NegativeReview", NegativeReviewSchema);
