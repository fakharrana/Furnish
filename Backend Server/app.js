var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var mongoose = require("mongoose");
var cors = require("./cors");

//MongoDB Local URL
const DatabaseURL = "mongodb://localhost:27017/Furnish";

// Create MongoDB connection
mongoose.connect(
  DatabaseURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  function (err) {
    if (err) {
      console.log("There was a problem connecting to the Database!" + err);
    } else {
      console.log("Successfully Connected to Database");
    }
  }
);

//Exporting DataBase Details
module.exports.databaseURL = "mongodb://localhost:27017/Furnish";
module.exports.connection = mongoose.connection;

//Importing Routers
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productsRouter = require("./routes/products");
var ordersRouter = require("./routes/orders");
var reviewAnalysisRouter = require("./routes/reviewanalysis");
var positiveReviewsRouter = require("./routes/positivereviews");
var negativeReviewsRouter = require("./routes/negativereviews");

var app = express();

//Initializing Passport Middleware
app.use(passport.initialize());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//For Cross Origin Resource Sharing
app.use(cors.cors);

//Using Routers
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/reviewanalysis", reviewAnalysisRouter)
app.use("/positivereviews", positiveReviewsRouter);
app.use("/negativereviews", negativeReviewsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).json({ error: err });
});

module.exports = app;
