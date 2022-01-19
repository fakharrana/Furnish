var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var utc = new Date();
var currentDate = utc.setHours(utc.getHours() + 5);

//Creating Order Schema
var OrderSchema = new Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerNumber: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
    required: true,
  },
  postalCode: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: currentDate,
  },
  deliverDate: {
    type: Date,
  },
  orderTotal: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    default: "In-Progress",
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  products: [
    {
      productName: { type: String, required: true },
      productID: { type: mongoose.Types.ObjectId, required: true },
      productCount: { type: Number, required: true },
      productPrice: { type: Number, required: true },
    },
  ],
});

//Exporting Order Model
module.exports = mongoose.model("Order", OrderSchema);
