var express = require("express");
var router = express.Router();
const controller = require("../controller/ReviewAnalysis");
const authentication = require("../authentication");

router.get("/", function (req, res, next) {
  res.send("Review Analysis");
});

// Analyze Reviews
router.get(
  "/analyzereviews",
  authentication.verifyUser,
  authentication.verifyAdmin,
  controller.analyzeReviews
);

module.exports = router;
