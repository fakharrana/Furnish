const NegativeReview = require("../model/NegativeReview");

// GET Negative Reviews
module.exports.getNegativeReviews = function (req, res, next) {
  NegativeReview.find({})
    .sort({ dateAnalyzed: -1 })
    .exec(function (error, negativeReviews) {
      // Check error
      if (error) {
        return res.json({ Error: "Error" });
      }
      // Negative Reviews exist
      return res.json(negativeReviews);
    });
};

//ADD Review
module.exports.addReview = function (req, res, next) {
  NegativeReview.create(
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
  NegativeReview.deleteOne({ _id: req.params.id }, function (error) {
    if (error) {
      return res.json({ Error: "Error" });
    }
    return res.json({ Success: "Successfully Deleted" });
  });
};

// Delete all reviews
module.exports.deleteAllReviews = function (req, res, next) {
  NegativeReview.deleteMany({}).exec(function (error) {
    if (error) {
      return res.json({ Error: "Error" });
    }
    return res.json({ Success: "Successfully Deleted" });
  });
};
