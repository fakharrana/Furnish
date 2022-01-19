var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var utc = new Date();
var currentDate = utc.setHours(utc.getHours() + 5);

//Creating PositiveReview Schema
var PositiveReviewSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  review: { type: String, required: true },
  dateAnalyzed: { type: Date, default: currentDate },
});

//Exporting PositiveReview Model
module.exports = mongoose.model("PositiveReview", PositiveReviewSchema);
