import React, { useState, useLayoutEffect } from "react";
import { Table, Col, Form } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./style/orderDetails.css";

const OrderDetails = (props) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderTotal, setOrderTotal] = useState("");

  const history = useHistory();
  const params = useParams();
  const orderid = params.id;

  //Hook for loading and re-loading data
  useLayoutEffect(() => {
    const getAccessToken = localStorage.getItem(
      process.env.REACT_APP_ACCESS_TOKEN
    );
    if (getAccessToken === null) {
      history.push("/login");
    } else {
      getOrderDetails();
    }
    // eslint-disable-next-line
  }, []);

  //Function for slicing date
  const sliceDate = (date) => {
    const slicedDate = date.slice(8, 10) + date.slice(4, 8) + date.slice(0, 4);
    return slicedDate;
  };

  //Axios Instance for Authenticated Requests With JWT Token
  const authAxios = new axios.create({
    baseURL: "http://localhost:4000",
    headers: {
      Authorization: `Bearer ${localStorage.getItem(
        process.env.REACT_APP_ACCESS_TOKEN
      )}`,
    },
  });

  //Function for retrieving order details from server
  const getOrderDetails = async () => {
    try {
      await authAxios.get(`/orders/order/${orderid}`).then(
        function (response) {
          setOrderTotal("PKR " + response.data.orderTotal);
          setOrderDetails(response.data);
        },
        function (error) {
          if (error.response.status === 401) {
            toast.error(" Please Log In Again", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
            });
            localStorage.removeItem(process.env.REACT_APP_ACCESS_TOKEN);
            props.redirectPage();
            history.push("/login");
          }
        }
      );
    } catch (error) {
      toast.error("Error: Failed to retrieve order details", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div className="order-details">
      <h4>
        <b>Order Details</b>
      </h4>

      <Form.Row>
        <Form.Group as={Col} controlId="order-id">
          <Form.Label className="label">Order ID</Form.Label>
          <Form.Control
            disabled
            className="shadow"
            type="text"
            defaultValue={orderDetails._id}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="customer-name">
          <Form.Label className="label">Customer Name</Form.Label>
          <Form.Control
            disabled
            className="shadow"
            type="text"
            defaultValue={orderDetails.customerName}
          />
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} controlId="postalcode">
          <Form.Label className="label">Postal Code</Form.Label>
          <Form.Control
            disabled
            className="shadow"
            type="text"
            defaultValue={orderDetails.postalCode}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="customer-address">
          <Form.Label className="label">Customer Address</Form.Label>
          <Form.Control
            disabled
            className="shadow"
            type="text"
            defaultValue={orderDetails.customerAddress}
          />
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} controlId="payment-method">
          <Form.Label className="label">Payment Method</Form.Label>
          <Form.Control
            disabled
            className="shadow"
            type="text"
            defaultValue={orderDetails.paymentMethod}
          />
        </Form.Group>

        {orderDetails.orderStatus === "In-Progress" ? (
          <Form.Group as={Col} controlId="order-date">
            <Form.Label className="label">Order Date</Form.Label>
            <Form.Control
              disabled
              className="shadow"
              type="text"
              defaultValue={sliceDate(orderDetails.orderDate)}
            />
          </Form.Group>
        ) : (
          <Form.Group as={Col} controlId="deliver-date">
            <Form.Label className="label">Deliver Date</Form.Label>
            <Form.Control
              disabled
              className="shadow"
              type="text"
              defaultValue={
                typeof orderDetails.deliverDate === "undefined"
                  ? ""
                  : sliceDate(orderDetails.deliverDate)
              }
            />
          </Form.Group>
        )}
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} controlId="status">
          <Form.Label className="label">Status</Form.Label>
          <Form.Control
            disabled
            className="shadow"
            type="text"
            defaultValue={orderDetails.orderStatus}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="total">
          <Form.Label className="label">Total</Form.Label>
          <Form.Control
            disabled
            className="shadow"
            type="text"
            defaultValue={orderTotal}
          />
        </Form.Group>
      </Form.Row>

      <Table hover className="shadow" size="sm">
        <thead className="thead-order-details">
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.length !== 0 ? (
            orderDetails.products.map((item, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{item.productName}</td>
                <td>PKR {item.productPrice}</td>
                <td>{item.productCount}</td>
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderDetails;
