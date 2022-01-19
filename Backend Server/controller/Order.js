const Order = require("../model/Order");
const Product = require("../model/Product");
const stripe = require("stripe")(
  "sk_test_51JqiF6LOCDkRRMGgiSDjHIhT5H5hrPfXeTTAxY9bnselMIsNE5LL4qxDo6FSM4QDY3hlZy16eRNWbpNxGlbMN46A00mflqc1ZA"
);

//Get current date
var utc = new Date();
var currentDate = utc.setHours(utc.getHours() + 5);

// GET New Orders list
module.exports.getNewOrders = function (req, res, next) {
  Order.find({ orderStatus: "In-Progress" })
    .select("_id customerEmail customerNumber orderDate orderTotal orderStatus")
    .sort({ orderDate: -1 })
    .exec(function (error, orders) {
      // Check error
      if (error) {
        return res.json({ Error: "Error" });
      }
      // Orders exist
      return res.json(orders);
    });
};

// GET New Delivered Orders list
module.exports.getDeliveredOrders = function (req, res, next) {
  Order.find({ orderStatus: "Delivered" })
    .select(
      "_id customerEmail customerNumber deliverDate orderTotal orderStatus"
    )
    .sort({ orderDate: -1 })
    .exec(function (error, orders) {
      // Check error
      if (error) {
        return res.json({ Error: "Error" });
      }
      // orders exist
      return res.json(orders);
    });
};

// GET Order Details
module.exports.getOrderDetails = function (req, res, next) {
  Order.findOne({ _id: req.params.id }).exec(function (error, orderDetails) {
    // Check error
    if (error) {
      return res.json({ Error: "Error" });
    }
    // orders exist
    return res.json(orderDetails);
  });
};

//ADD New Order
module.exports.addNewOrder = function (req, res, next) {
  Order.create(
    {
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerNumber: req.body.customerNumber,
      customerAddress: req.body.customerAddress,
      postalCode: req.body.postalCode,
      orderTotal: req.body.orderTotal,
      products: req.body.products,
      paymentMethod: req.body.paymentMethod,
    },
    function (error, order) {
      if (error) {
        return res.json({ Error: "Unable to add order, please try again" });
      } else {
        req.body.products.map((item, index) => {
          Product.updateMany(
            { _id: item.productID },
            {
              $inc: {
                productQuantity: -item.productCount,
                soldQuantity: item.productCount,
              },
            }
          ).exec(function (err, product) {
            if (err) {
              return res.json({ Error: "Unable to update quantity" });
            }
          });
        });
        return res.json(order._id);
      }
    }
  );
};

//Change Order Status to Delivered
module.exports.deliverOrder = function (req, res, next) {
  Order.findByIdAndUpdate(
    { _id: req.params.id },
    {
      orderStatus: "Delivered",
      deliverDate: currentDate,
    },
    function (error, data) {
      if (error) {
        return res.json({ Error: "Error" });
      }
      return res.json({ Success: "Successfully Delivered" });
    }
  );
};

//Delete Order
module.exports.deleteOrder = function (req, res, next) {
  Order.deleteOne({ _id: req.params.id }, function (error) {
    if (error) {
      return res.json({ Error: "Error" });
    }
    return res.json({ Success: "Successfully Deleted" });
  });
};

//Delete All Orders
module.exports.deleteAllOrders = function (req, res, next) {
  Order.deleteMany({ orderStatus: "Delivered" }, function (error, data) {
    if (error) {
      return res.json({ Error: "Error" });
    }
    return res.json({ Success: "Successfully Deleted" });
  });
};

// GET Curent Order list of a Specific User
module.exports.getCurrentOrdersOfSpecificUser = function (req, res, next) {
  Order.find({ customerEmail: req.params.email, orderStatus: "In-Progress" })
    .sort({ orderDate: -1 })
    .exec(function (error, orders) {
      // Check error
      if (error) {
        return res.json({ Error: "Error" });
      }
      // Orders exist
      return res.json(orders);
    });
};

// GET Delivered  Order list of a Specific User
module.exports.getDeliveredOrdersOfSpecificUser = function (req, res, next) {
  Order.find({ customerEmail: req.params.email, orderStatus: "Delivered" })
    .sort({ orderDate: -1 })
    .exec(function (error, orders) {
      // Check error
      if (error) {
        return res.json({ Error: "Error" });
      }
      // orders exist
      return res.json(orders);
    });
};

//For Online Payment
module.exports.getPayment = async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(items + "00"),
    currency: "pkr",
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};
