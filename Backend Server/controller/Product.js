const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const Product = require("../model/Product");
const pythonShell = require("python-shell"); //To run python scripts
const DataBase = require("../app");

// MongoDB URL
const databaseURL = DataBase.databaseURL;

// Create MongoDB connection
const connection = DataBase.connection;

// Init GridFS
let gfs;

connection.once("open", () => {
  // Init stream
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection("file");
});

// Create storage engine
const storage = new GridFsStorage({
  url: databaseURL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "file",
        };
        resolve(fileInfo);
      });
    });
  },
});
module.exports.upload = multer({ storage });

//Get Products List
module.exports.getAllProducts = function (req, res, next) {
  Product.find()
    .select("-reviews ")
    .sort({ dateAdded: -1 })
    .exec(function (error, products) {
      // Check error
      if (error) {
        return res.json({ Error: "Error" });
      }
      // Products exist
      return res.json(products);
    });
};

//Get a Product
module.exports.getProduct = function (req, res, next) {
  Product.findOne({ _id: req.params.productid }).exec(function (
    error,
    product
  ) {
    // Check error
    if (error) {
      return res.json({ Error: "Error" });
    }
    // Product exists
    return res.json(product);
  });
};

//Add a Product
module.exports.addProduct = function (req, res, next) {
  Product.create(
    {
      productName: req.body.productName,
      productCategory: req.body.productCategory,
      productDescription: req.body.productDescription,
      productPrice: req.body.productPrice,
      productQuantity: req.body.productQuantity,
      productThumbnail: req.files[0].filename,
      productImages: [
        req.files[1].filename,
        req.files[2].filename,
        req.files[3].filename,
      ],
      productModel: req.files[4].filename,
    },
    function (error, data) {
      if (error) {
        return res.json({ Error: "Error" });
      }
      return res.json({ Success: "Successfully Added" });
    }
  );
};

//Modify a Product
module.exports.modifyProduct = function (req, res, next) {
  const oldFiles = req.body.oldFiles;
  const changed = JSON.parse(req.body.changed);

  if (
    changed.productText === true &&
    changed.productThumbnail === false &&
    changed.productImages === false &&
    changed.productModel === false
  ) {
    Product.findByIdAndUpdate(
      req.body.productid,
      {
        productName: req.body.productName,
        productCategory: req.body.productCategory,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productQuantity: req.body.productQuantity,
      },
      function (error, data) {
        if (error) {
          return res.json({ Error: "Error" });
        } else {
          return res.json({ Success: "Successfully Updated" });
        }
      }
    );
  } else if (
    changed.productText === true &&
    changed.productThumbnail === true &&
    changed.productImages === false &&
    changed.productModel === false
  ) {
    Product.findByIdAndUpdate(
      req.body.productid,
      {
        productName: req.body.productName,
        productCategory: req.body.productCategory,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productQuantity: req.body.productQuantity,
        productThumbnail: req.files[0].filename,
      },
      function (error, data) {
        if (error) {
          return res.json({ Error: " Uploading Error" });
        } else {
          gfs.remove(
            { filename: oldFiles, root: "file" },
            (error, gridStore) => {
              if (error) {
                return res.json({ Error: "Deleting Error" });
              }
            }
          );
        }
      }
    );
    return res.json({ Success: "Successfully Updated" });
  } else if (
    changed.productText === true &&
    changed.productThumbnail === false &&
    changed.productImages === true &&
    changed.productModel === false
  ) {
    Product.findByIdAndUpdate(
      req.body.productid,
      {
        productName: req.body.productName,
        productCategory: req.body.productCategory,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productQuantity: req.body.productQuantity,
        productImages: [
          req.files[0].filename,
          req.files[1].filename,
          req.files[2].filename,
        ],
      },
      function (error, data) {
        if (error) {
          return res.json({ Error: " Uploading Error" });
        } else {
          for (let i = 0; i < oldFiles.length; i++) {
            gfs.remove(
              { filename: oldFiles[i], root: "file" },
              (error, gridStore) => {
                if (error) {
                  return res.json({ Error: "Deleting Error" });
                }
              }
            );
          }
        }
      }
    );
    return res.json({ Success: "Successfully Updated" });
  } else if (
    changed.productText === true &&
    changed.productThumbnail === false &&
    changed.productImages === false &&
    changed.productModel === true
  ) {
    Product.findByIdAndUpdate(
      req.body.productid,
      {
        productName: req.body.productName,
        productCategory: req.body.productCategory,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productQuantity: req.body.productQuantity,
        productModel: req.files[0].filename,
      },
      function (error, data) {
        if (error) {
          return res.json({ Error: " Uploading Error" });
        } else {
          gfs.remove(
            { filename: oldFiles, root: "file" },
            (error, gridStore) => {
              if (error) {
                return res.json({ Error: "Deleting Error" });
              }
            }
          );
        }
      }
    );
    return res.json({ Success: "Successfully Updated" });
  } else if (
    changed.productText === true &&
    changed.productThumbnail === true &&
    changed.productImages === true &&
    changed.productModel === false
  ) {
    Product.findByIdAndUpdate(
      req.body.productid,
      {
        productName: req.body.productName,
        productCategory: req.body.productCategory,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productQuantity: req.body.productQuantity,
        productThumbnail: req.files[0].filename,
        productImages: [
          req.files[1].filename,
          req.files[2].filename,
          req.files[3].filename,
        ],
      },
      function (error, data) {
        if (error) {
          return res.json({ Error: " Uploading Error" });
        } else {
          for (let i = 0; i < oldFiles.length; i++) {
            gfs.remove(
              { filename: oldFiles[i], root: "file" },
              (error, gridStore) => {
                if (error) {
                  return res.json({ Error: "Deleting Error" });
                }
              }
            );
          }
        }
      }
    );
    return res.json({ Success: "Successfully Updated" });
  } else if (
    changed.productText === true &&
    changed.productThumbnail === false &&
    changed.productImages === true &&
    changed.productModel === true
  ) {
    Product.findByIdAndUpdate(
      req.body.productid,
      {
        productName: req.body.productName,
        productCategory: req.body.productCategory,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productQuantity: req.body.productQuantity,
        productImages: [
          req.files[0].filename,
          req.files[1].filename,
          req.files[2].filename,
        ],
        productModel: req.files[3].filename,
      },
      function (error, data) {
        if (error) {
          return res.json({ Error: " Uploading Error" });
        } else {
          for (let i = 0; i < oldFiles.length; i++) {
            gfs.remove(
              { filename: oldFiles[i], root: "file" },
              (error, gridStore) => {
                if (error) {
                  return res.json({ Error: "Deleting Error" });
                }
              }
            );
          }
        }
      }
    );
    return res.json({ Success: "Successfully Updated" });
  } else if (
    changed.productText === true &&
    changed.productThumbnail === true &&
    changed.productImages === false &&
    changed.productModel === true
  ) {
    Product.findByIdAndUpdate(
      req.body.productid,
      {
        productName: req.body.productName,
        productCategory: req.body.productCategory,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productQuantity: req.body.productQuantity,
        productThumbnail: req.files[0].filename,
        productModel: req.files[1].filename,
      },
      function (error, data) {
        if (error) {
          return res.json({ Error: " Uploading Error" });
        } else {
          for (let i = 0; i < oldFiles.length; i++) {
            gfs.remove(
              { filename: oldFiles[i], root: "file" },
              (error, gridStore) => {
                if (error) {
                  return res.json({ Error: "Deleting Error" });
                }
              }
            );
          }
        }
      }
    );
    return res.json({ Success: "Successfully Updated" });
  } else if (
    changed.productText === true &&
    changed.productThumbnail === true &&
    changed.productImages === true &&
    changed.productModel === true
  ) {
    Product.findByIdAndUpdate(
      req.body.productid,
      {
        productName: req.body.productName,
        productCategory: req.body.productCategory,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice,
        productQuantity: req.body.productQuantity,
        productThumbnail: req.files[0].filename,
        productImages: [
          req.files[1].filename,
          req.files[2].filename,
          req.files[3].filename,
        ],
        productModel: req.files[4].filename,
      },
      function (error, data) {
        if (error) {
          return res.json({ Error: " Uploading Error" });
        } else {
          for (let i = 0; i < oldFiles.length; i++) {
            gfs.remove(
              { filename: oldFiles[i], root: "file" },
              (error, gridStore) => {
                if (error) {
                  return res.json({ Error: "Deleting Error" });
                }
              }
            );
          }
        }
      }
    );
    return res.json({ Success: "Successfully Updated" });
  } else {
  }
};

//Get a Product Thumbnail
module.exports.getThumbnail = function (req, res) {
  gfs.files.findOne({ filename: req.params.filename }, function (error, file) {
    // Check if file
    if (!file || file.length === 0) {
      return res.json({
        Error: "No file exists",
      });
    }
    // Check if File type
    if (
      file.contentType === "image/jpg" ||
      file.contentType === "image/jpeg" ||
      file.contentType === "image/png"
    ) {
      // Read output
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      return res.json({
        Error: "Error",
      });
    }
  });
};

//Get a Product Image
module.exports.getImage = function (req, res) {
  gfs.files.findOne({ filename: req.params.filename }, function (error, file) {
    // Check if file
    if (!file || file.length === 0) {
      return res.json({
        Error: "No file exists",
      });
    }
    // Check if File type
    if (
      file.contentType === "image/jpg" ||
      file.contentType === "image/jpeg" ||
      file.contentType === "image/png"
    ) {
      // Read output
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      return res.json({
        Error: "Error",
      });
    }
  });
};

//Get a Product Model
module.exports.getModel = function (req, res) {
  gfs.files.findOne({ filename: req.params.filename }, function (error, file) {
    // Check if file
    if (!file || file.length === 0) {
      return res.json({
        Error: "No file exists",
      });
    }
    // Check if File type
    if (file.contentType === "application/octet-stream") {
      // Read output
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      return res.json({
        Error: "Error",
      });
    }
  });
};

//Delete a Product
module.exports.deleteProduct = function (req, res) {
  const productdetails = req.params.productdetails.split(",");

  Product.deleteOne({ _id: productdetails[0] }, function (error) {
    if (error) {
      return res.json({ Error: "Error" });
    } else {
      for (let i = 1; i < productdetails.length; i++) {
        gfs.remove(
          { filename: productdetails[i], root: "file" },
          (error, gridStore) => {
            if (error) {
              return res.json({ Error: "Error" });
            }
          }
        );
      }
    }
  });
  return res.json({ Success: "Successfully Deleted" });
};

//Add New Review
module.exports.addReview = function (req, res) {
  Product.updateOne(
    { _id: req.body.productid },
    {
      $push: {
        reviews: { userEmail: req.body.userEmail, review: req.body.review },
      },
    },
    function (err, result) {
      if (err) {
        return res.json({ Error: "Unable to add review" });
      }
      return res.json({ Success: "Review Successfully Added" });
    }
  );
};

//Get All Reviews on a Specific Product
module.exports.getAllReviewsOnProduct = function (req, res) {
  Product.findOne({ _id: req.params.id })
    .select("-_id reviews")
    .exec(function (err, reviews) {
      if (err) {
        return res.json({ Error: "Unable to retrieve reviews" });
      }
      return res.json(reviews.reviews);
    });
};

//Delete a review
module.exports.deleteReview = function (req, res) {
  let reviewDetails = req.params.reviewdetails.toString().split(",");
  let productid = reviewDetails[0];
  let reviewid = reviewDetails[1];

  Product.updateOne(
    { _id: productid },
    { $pull: { reviews: { _id: reviewid } } },
    function (err, review) {
      if (err) {
        return res.json({ Error: "Unable to delete review" });
      }
      return res.json({ Success: "Review successfully deleted" });
    }
  );
};

//Recommend Products
module.exports.recommendProducts = function (req, res) {
  let productDetails = req.params.productdetails.toString().split(",");
  let productName = productDetails[0];
  let productCategory = productDetails[1];

  let options = {
    mode: "text",
    pythonOptions: ["-u"], //print results in real-time
    //scriptPath: "C:/Project/Furnish-Web-App/Server/python/scripts/",
    scriptPath: "./python/scripts",
    args: [productName],
  };

  pythonShell.PythonShell.run(
    "productRecommendation.py",
    options,
    function (err, response) {
      if (err) {
        return res.json({ Error: "Unable to recommend products" });
      }
      if (response === null || response.toString() === "[]") {
        if (productCategory === "Bed") {
          Product.find({ productCategory: "Desk" })
            .select("-reviews")
            .exec(function (err, products) {
              return res.json(products);
            });
        } else if (productCategory === "Table") {
          Product.find({ productCategory: "Chair" })
            .select("-reviews")
            .exec(function (err, products) {
              return res.json(products);
            });
        } else if (productCategory === "Sofa") {
          Product.find({ productCategory: "Bed" })
            .select("-reviews")
            .exec(function (err, products) {
              return res.json(products);
            });
        } else if (productCategory === "Desk") {
          Product.find({ productCategory: "Bed" })
            .select("-reviews")
            .exec(function (err, products) {
              return res.json(products);
            });
        } else {
          Product.find({ productCategory: "Desk" })
            .select("-reviews")
            .exec(function (err, products) {
              return res.json(products);
            });
        }
      } else {
        let recommendations = response.toString().split(",");
        recommendations.pop(); //list of recommended products

        //getting data of recommended products from database
        Product.find({
          productName: {
            $in: recommendations,
          },
        })
          .select("-reviews")
          .exec(function (err, products) {
            return res.json(products);
          });
      }
    }
  );
};
