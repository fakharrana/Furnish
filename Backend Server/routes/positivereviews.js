var express = require("express");
var router = express.Router();
const controller = require("../controller/PositiveReview");
const authentication = require("../authentication");

// GET Positive Reviews
router.get(
  "/",
  authentication.verifyUser,
  authentication.verifyAdmin,
  controller.getPositiveReviews
);

//Add Review
router.post("/addreview", controller.addReview);

// Delete a review
router.delete(
  "/deletereview/:id",
  authentication.verifyUser,
  authentication.verifyAdmin,
  controller.deleteReview
);

// Delete all reviews
router.delete(
  "/deleteallreviews",
  authentication.verifyUser,
  authentication.verifyAdmin,
  controller.deleteAllReviews
);

module.exports = router;
