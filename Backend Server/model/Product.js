var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var utc = new Date();
var currentDate = utc.setHours(utc.getHours() + 5);

//Creating Product Schema
var productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productQuantity: {
    type: Number,
    required: true,
  },
  soldQuantity: {
    type: Number,
    default: 0,
  },
  productThumbnail: {
    type: String,
    required: true,
  },
  productImages: [
    {
      type: String,
      required: true,
    },
  ],
  productModel: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: currentDate,
  },
  reviews: [
    {
      userEmail: { type: String, required: true },
      review: { type: String, required: true },
      date: { type: Date, default: currentDate },
      analyzed: { type: Number, default: 0 },
    },
  ],
  count: {
    type: Number,
    default: 1,
  },
});

//Exporting Product Model
module.exports = mongoose.model("Product", productSchema);
