var express = require("express");
var router = express.Router();
const controller = require("../controller/Product");
const authentication = require("../authentication");

// GET Product list
router.get("/", authentication.verifyUser, controller.getAllProducts);

// GET single product
router.get("/:productid", authentication.verifyUser, controller.getProduct);

//ADD a product
router.post(
  "/addproduct",
  controller.upload.array("files"),
  controller.addProduct
);

//Modify a product
router.put(
  "/modifyproduct",
  authentication.verifyUser,
  authentication.verifyAdmin,
  controller.upload.array("files"),
  controller.modifyProduct
);

// GET product thumbnail
router.get("/thumbnail/:filename", controller.getThumbnail);

// GET product image
router.get("/image/:filename", controller.getImage);

// GET product model
router.get("/model/:filename", controller.getModel);

//Delete a product
router.delete(
  "/:productdetails",
  authentication.verifyUser,
  authentication.verifyAdmin,
  controller.deleteProduct
);

//Add New Review
router.put("/addreview", authentication.verifyUser, controller.addReview);

//Get All Reviews on a Specific Product
router.get(
  "/getreviews/:id",
  authentication.verifyUser,
  controller.getAllReviewsOnProduct
);

//Delete a review
router.delete(
  "/deletereview/:reviewdetails",
  authentication.verifyUser,
  controller.deleteReview
);

//Recommend Products
router.get(
  "/recommendproducts/:productdetails",
  authentication.verifyUser,
  controller.recommendProducts
);

module.exports = router;
