const PositiveReview = require("../model/PositiveReview");

// GET Positive Reviews
module.exports.getPositiveReviews = function (req, res, next) {
  PositiveReview.find({})
    .sort({ dateAnalyzed: -1 })
    .exec(function (error, positiveReviews) {
      // Check error
      if (error) {
        return res.json({ Error: "Error" });
      }
      // Positive Reviews exist
      return res.json(positiveReviews);
    });
};

//ADD Review
module.exports.addReview = function (req, res, next) {
  PositiveReview.create(
    {
      productName: req.body.productName,
      review: req.body.review,
    },
    function (error, data) {
      if (error) {
        return res.json({ Error: "Error" });
      }
      return res.json({ Success: "Successfully Added" });
    }
  );
};

// Delete a review
module.exports.deleteReview = function (req, res, next) {
  PositiveReview.deleteOne({ _id: req.params.id }, function (error) {
    if (error) {
      return res.json({ Error: "Error" });
    }
    return res.json({ Success: "Successfully Deleted" });
  });
};

// Delete all reviews
module.exports.deleteAllReviews = function (req, res, next) {
  PositiveReview.deleteMany({}).exec(function (error) {
    if (error) {
      return res.json({ Error: "Error" });
    }
    return res.json({ Success: "Successfully Deleted" });
  });
};
