import React, { useState, useLayoutEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import LogIn from "./components/pages/LogIn";
import ChangePassword from "./components/pages/ChangePassword";
import ForgotPassword from "./components/pages/ForgotPassword";
import Dashboard from "./components/pages/Dashboard";
import Products from "./components/pages/Products";
import AddNewProduct from "./components/pages/AddNewProduct.js";
import ViewModel from "./components/pages/ViewModel";
import ModifyProduct from "./components/pages/ModifyProduct";
import Orders from "./components/pages/Orders";
import OrderDetails from "./components/pages/OrderDetails";
import Delivered from "./components/pages/Delivered";
import Customers from "./components/pages/Customers";
import ReviewAnalysis from "./components/pages/ReviewAnalysis";
import PositiveReviews from "./components/pages/PositiveReviews";
import NegativeReviews from "./components/pages/NegativeReviews";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [refresh, setRefresh] = useState(0);

  useLayoutEffect(() => {}, [refresh]);

  const redirectPage = () => {
    setRefresh(Math.floor(Math.random() * 1000));
  };

  return (
    <>
      <Router>
        <Navbar refresh={refresh} />
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route
            exact
            path="/login"
            render={(props) => <LogIn {...props} redirectPage={redirectPage} />}
          />
          <Route
            exact
            path="/changepassword"
            render={(props) => (
              <ChangePassword {...props} redirectPage={redirectPage} />
            )}
          />
          <Route exact path="/forgotpassword" component={ForgotPassword} />
          <Route
            exact
            path="/products"
            render={(props) => (
              <Products {...props} redirectPage={redirectPage} />
            )}
          />

          <Route
            exact
            path="/products/addproduct"
            render={(props) => (
              <AddNewProduct {...props} redirectPage={redirectPage} />
            )}
          />

          <Route
            exact
            path="/products/viewmodel/:id"
            render={(props) => (
              <ViewModel {...props} redirectPage={redirectPage} />
            )}
          />

          <Route
            exact
            path="/products/modifyproduct/:id"
            render={(props) => (
              <ModifyProduct {...props} redirectPage={redirectPage} />
            )}
          />

          <Route
            exact
            path="/orders"
            render={(props) => (
              <Orders {...props} redirectPage={redirectPage} />
            )}
          />

          <Route
            exact
            path="/orders/orderdetails/:id"
            render={(props) => (
              <OrderDetails {...props} redirectPage={redirectPage} />
            )}
          />

          <Route
            exact
            path="/deliveredorders"
            render={(props) => (
              <Delivered {...props} redirectPage={redirectPage} />
            )}
          />

          <Route
            exact
            path="/deliveredorders/orderdetails/:id"
            render={(props) => (
              <OrderDetails {...props} redirectPage={redirectPage} />
            )}
          />

          <Route
            exact
            path="/customers"
            render={(props) => (
              <Customers {...props} redirectPage={redirectPage} />
            )}
          />

          <Route
            exact
            path="/reviewanalysis"
            render={(props) => (
              <ReviewAnalysis {...props} redirectPage={redirectPage} />
            )}
          />

          <Route
            exact
            path="/reviewanalysis/positivereviews"
            render={(props) => (
              <PositiveReviews {...props} redirectPage={redirectPage} />
            )}
          />

          <Route
            exact
            path="/reviewanalysis/negativereviews"
            render={(props) => (
              <NegativeReviews {...props} redirectPage={redirectPage} />
            )}
          />
        </Switch>
      </Router>
      <ToastContainer />
    </>
  );
};

export default App;
