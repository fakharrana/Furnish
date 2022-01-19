const login = require("./tests/login.js");
const changepassword = require("./tests/changepassword.js");
const forgotpassword = require("./tests/forgotpassword.js");
const addproduct = require("./tests/addproduct.js");
const deleteproduct = require("./tests/deleteproduct.js");
const modifyproduct = require("./tests/modifyproduct.js");
const viewproducts = require("./tests/viewproducts.js");
const viewmodel = require("./tests/viewmodel.js");
const viewneworders = require("./tests/viewneworders.js");
const deleteorder = require("./tests/deleteorder.js");
const deliverorder = require("./tests/deliverorder.js");
const viewdeliveredorders = require("./tests/viewdeliveredorders.js");
const vieworderdetails = require("./tests/vieworderdetails.js");
const viewcustomers = require("./tests/viewcustomers.js");
const deletecustomer = require("./tests/deletecustomer.js");
const filterproductsbyname = require("./tests/filterproductsbyname.js");
const filterproductsbycategory = require("./tests/filterproductsbycategory.js");
const filternewordersbyemail = require("./tests/filternewordersbyemail.js");
const filternewordersbyorderdate = require("./tests/filternewordersbyorderdate.js");
const filterdeliveredordersbyemail = require("./tests/filterdeliveredordersbyemail.js");
const filterdeliveredordersbyorderdate = require("./tests/filterdeliveredordersbyorderdate.js");
const filtercustomersbyemail = require("./tests/filtercustomersbyemail.js");
const analyzereviews = require("./tests/analyzereviews.js");
const viewpositivereviews = require("./tests/viewpositivereviews.js");
const filterpositivereviewsbyproductname = require("./tests/filterpositivereviewsbyproductname.js");
const filterpositivereviewsbyanalyzeddate = require("./tests/filterpositivereviewsbyanalyzeddate.js");
const deletepositivereview = require("./tests/deletepositivereview.js");
const viewnegativereviews = require("./tests/viewnegativereviews.js");
const filternegativereviewsbyproductname = require("./tests/filternegativereviewsbyproductname.js");
const filternegativereviewsbyanalyzeddate = require("./tests/filternegativereviewsbyanalyzeddate.js");
const deletenegativereview = require("./tests/deletenegativereview.js");
const logout = require("./tests/logout.js");

const test = {
  logIn: () => login.login(),
  changePassword: () => changepassword.changepassword(),
  forgotPassword: () => forgotpassword.forgotpassword(),
  addProduct: () => addproduct.addproduct(),
  deleteProduct: () => deleteproduct.deleteproduct(),
  modifyProduct: () => modifyproduct.modifyproduct(),
  viewProducts: () => viewproducts.viewproducts(),
  viewModel: () => viewmodel.viewmodel(),
  viewNewOrders: () => viewneworders.viewneworders(),
  deleteOrder: () => deleteorder.deleteorder(),
  deliverOrder: () => deliverorder.deliverorder(),
  viewDeliveredOrders: () => viewdeliveredorders.viewdeliveredorders(),
  viewOrderDetails: () => vieworderdetails.vieworderdetails(),
  viewCustomers: () => viewcustomers.viewcustomers(),
  deleteCustomer: () => deletecustomer.deletecustomer(),
  filterProductsByName: () => filterproductsbyname.filterproductsbyname(),
  filterProductsByCategory: () =>
    filterproductsbycategory.filterproductsbycategory(),
  filterNewOrdersByEmail: () => filternewordersbyemail.filternewordersbyemail(),
  filterNewOrdersByOrderDate: () =>
    filternewordersbyorderdate.filternewordersbyorderdate(),
  filterDeliveredOrdersByEmail: () =>
    filterdeliveredordersbyemail.filterdeliveredordersbyemail(),
  filterDeliveredOrdersByOrderDate: () =>
    filterdeliveredordersbyorderdate.filterdeliveredordersbyorderdate(),
  filterCustomersByEmail: () => filtercustomersbyemail.filtercustomersbyemail(),
  analyzeReviews: () => analyzereviews.analyzereviews(),
  viewPositiveReviews: () => viewpositivereviews.viewpositivereviews(),
  filterPositiveReviewsByProductName: () =>
    filterpositivereviewsbyproductname.filterpositivereviewsbyproductname(),
  filterPositiveReviewsByAnalyzedDate: () =>
    filterpositivereviewsbyanalyzeddate.filterpositivereviewsbyanalyzeddate(),
  deletePositiveReview: () => deletepositivereview.deletepositivereview(),
  viewNegativeReviews: () => viewnegativereviews.viewnegativereviews(),
  filterNegativeReviewsByProductName: () =>
    filternegativereviewsbyproductname.filternegativereviewsbyproductname(),
  filterNegativeReviewsByAnalyzedDate: () =>
    filternegativereviewsbyanalyzeddate.filternegativereviewsbyanalyzeddate(),
  deleteNegativeReview: () => deletenegativereview.deletenegativereview(),
  logOut: () => logout.logout(),
};

//console.log(Object.keys(test).length);
//test.logIn();
//node main.js
