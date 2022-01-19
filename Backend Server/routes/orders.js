var express = require("express");
var router = express.Router();
const controller = require("../controller/Order");
const authentication = require("../authentication");

// GET New Orders list
router.get(
  "/",
  authentication.verifyUser,
  authentication.verifyAdmin,
  controller.getNewOrders
);

// GET New Delivered Orders list
router.get(
  "/deliveredorders",
  authentication.verifyUser,
  authentication.verifyAdmin,
  controller.getDeliveredOrders
);

// GET Order Details
router.get("/order/:id", authentication.verifyUser, controller.getOrderDetails);

//ADD New Order
router.post("/addorder", authentication.verifyUser, controller.addNewOrder);

//Change Order Status to Delivered
router.put(
  "/deliverorder/:id",
  authentication.verifyUser,
  authentication.verifyAdmin,
  controller.deliverOrder
);

//Delete Order
router.delete(
  "/deleteorder/:id",
  authentication.verifyUser,
  authentication.verifyAdmin,
  controller.deleteOrder
);

//Delete All Orders
router.delete(
  "/deleteallorders",
  authentication.verifyUser,
  authentication.verifyAdmin,
  controller.deleteAllOrders
);

// GET Curent Order list of a Specific User
router.get(
  "/currentorders/:email",
  authentication.verifyUser,
  controller.getCurrentOrdersOfSpecificUser
);

// GET Delivered Order list of a Specific User
router.get(
  "/deliveredorders/:email",
  authentication.verifyUser,
  controller.getDeliveredOrdersOfSpecificUser
);

//For Online Payment
router.post("/payment", authentication.verifyUser, controller.getPayment);

module.exports = router;
