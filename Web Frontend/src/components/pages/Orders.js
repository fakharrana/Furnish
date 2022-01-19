import React, { useState, useLayoutEffect } from "react";
import { Table, Col, Row } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiDetail } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { CgArrowUpR } from "react-icons/cg";
import { CgArrowDownR } from "react-icons/cg";
import { Link, useHistory } from "react-router-dom";
import { Ring } from "react-spinners-css";
import { toast } from "react-toastify";
import axios from "axios";
import "./style/orders.css";
import DeleteConfirmation from "./../confirmations/DeleteConfirmation";
import DeliverConfirmation from "./../confirmations/DeliverConfirmation";

const Orders = (props) => {
  const [data, setData] = useState([]);
  const [searchedEmail, setSearchedEmail] = useState("");
  const [searchedDate, setSearchedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [orderID, setOrderID] = useState("");
  const [type, setType] = useState("");
  const [getSorting, setSorting] = useState([-1, -1, -1]);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);

  const history = useHistory();

  //Hook for loading and re-loading data
  useLayoutEffect(() => {
    const getAccessToken = localStorage.getItem(
      process.env.REACT_APP_ACCESS_TOKEN
    );
    if (getAccessToken === null) {
      history.push("/login");
    } else {
      getNewOrders();
    }
    // eslint-disable-next-line
  }, [refresh]);

  //Function for slicing date
  const sliceDate = (date) => {
    const slicedDate = date.slice(8, 10) + date.slice(4, 8) + date.slice(0, 4);
    return slicedDate;
  };

  //Function for filtering orders by order date or customer email
  let orders = data.filter((item) => {
    return (
      item.customerEmail
        .toLowerCase()
        .includes(searchedEmail.toLowerCase().trim()) &&
      sliceDate(item.orderDate)
        .toString()
        .includes(searchedDate.toLowerCase().trim())
    );
  });

  //Axios Instance for Authenticated Requests With JWT Token
  const authAxios = new axios.create({
    baseURL: "http://localhost:4000",
    headers: {
      Authorization: `Bearer ${localStorage.getItem(
        process.env.REACT_APP_ACCESS_TOKEN
      )}`,
    },
  });

  //Function for retrieving new orders/data from server
  const getNewOrders = async () => {
    try {
      await authAxios.get("/orders").then(
        function (response) {
          setData(response.data);
          setIsLoading(false);
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
    } catch (err) {
      toast.error("Error: Failed to retrieve orders", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };

  // Function for sorting data alphabetically
  const sortAlphabetically = (sorting, index, fieldName) => {
    let temp = getSorting;
    if (sorting === "ascending") {
      temp[index] = 1;
      setSorting(temp);
      orders = data.sort(function (a, b) {
        if (fieldName === "customerEmail") {
          return a.customerEmail.localeCompare(b.customerEmail);
        } else {
          return a.orderDate.localeCompare(b.orderDate);
        }
      });
    } else {
      temp[index] = -1;
      setSorting(temp);
      orders = data.sort(function (a, b) {
        if (fieldName === "customerEmail") {
          return b.customerEmail.localeCompare(a.customerEmail);
        } else {
          return b.orderDate.localeCompare(a.orderDate);
        }
      });
    }
  };

  // Function for sorting data numerically
  const sortNumerically = (sorting, index) => {
    let temp = getSorting;
    if (sorting === "ascending") {
      temp[index] = 1;
      setSorting(temp);
      orders = data.sort(function (a, b) {
        return a.orderTotal - b.orderTotal;
      });
    } else {
      temp[index] = -1;
      setSorting(temp);
      orders = data.sort(function (a, b) {
        return b.orderTotal - a.orderTotal;
      });
    }
  };

  // Function for displaying the deliver confirmation modal
  const deliverConfirmation = (id) => {
    setType("deliver");
    setOrderID(id);
    setConfirmationMessage("Are you sure you want to deliver the order?");
    setDisplayConfirmationModal(true);
  };

  //Function for changing order status to delivered
  const deliverOrder = async (orderID) => {
    try {
      await authAxios.put(`/orders/deliverorder/${orderID}`).then(
        function (response) {
          toast.success(response.data.Success, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
          });
          setRefresh(Math.floor(Math.random() * 1000));
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
    } catch (err) {
      toast.error("Error: Failed to deliver order", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
    setDisplayConfirmationModal(false);
  };

  // Function for displaying the delete confirmation modal
  const deleteConfirmation = (id) => {
    setType("order");
    setOrderID(id);
    setConfirmationMessage("Are you sure you want to delete the order?");
    setDisplayConfirmationModal(true);
  };

  // Function to hide the modal
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  //Function for deleting an order
  const deleteOrder = async (orderID) => {
    try {
      await authAxios.delete(`/orders/deleteorder/${orderID}`).then(
        function (response) {
          toast.success(response.data.Success, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
          });
          setRefresh(Math.floor(Math.random() * 1000));
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
    } catch (err) {
      toast.error("Error: Failed to delete order", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
    setDisplayConfirmationModal(false);
  };

  return (
    <div className="orders">
      <Row className="top-row-orders">
        <Col>
          <h4 className="top-row-title-orders">
            <b>Orders ({data.length})</b>
          </h4>
        </Col>
        <Col>
          <input
            id="filter-by-email"
            className="search-bar-orders shadow "
            type="text"
            placeholder="Filter orders by customer email"
            onChange={(e) => setSearchedEmail(e.target.value)}
          />
        </Col>
        <Col>
          <input
            id="filter-by-date"
            className="search-bar-orders shadow "
            type="text"
            placeholder="Filter orders by order date"
            onChange={(e) => setSearchedDate(e.target.value)}
          />
        </Col>
      </Row>

      <Table hover className="shadow" size="sm">
        <thead className="thead-orders">
          <tr>
            <th>#</th>
            <th>
              Customer Email
              {getSorting[0] === -1 ? (
                <Link
                  onClick={() =>
                    sortAlphabetically("ascending", 0, "customerEmail")
                  }
                  title="Sort Ascendingly"
                  class="sort_a"
                >
                  <CgArrowUpR size={17} />
                </Link>
              ) : (
                <Link
                  onClick={() =>
                    sortAlphabetically("descending", 0, "customerEmail")
                  }
                  title="Sort Descendingly"
                  class="sort_d"
                >
                  <CgArrowDownR size={17} />
                </Link>
              )}
            </th>
            <th>Customer Number</th>
            <th>
              Order Date
              {getSorting[1] === -1 ? (
                <Link
                  onClick={() =>
                    sortAlphabetically("ascending", 1, "orderDate")
                  }
                  title="Sort Ascendingly"
                  class="sort_a"
                >
                  <CgArrowUpR size={17} />
                </Link>
              ) : (
                <Link
                  onClick={() =>
                    sortAlphabetically("descending", 1, "orderDate")
                  }
                  title="Sort Descendingly"
                  class="sort_d"
                >
                  <CgArrowDownR size={17} />
                </Link>
              )}
            </th>
            <th>
              Total
              {getSorting[2] === -1 ? (
                <Link
                  onClick={() => sortNumerically("ascending", 2)}
                  title="Sort Ascendingly"
                  class="sort_a"
                >
                  <CgArrowUpR size={17} />
                </Link>
              ) : (
                <Link
                  onClick={() => sortNumerically("descending", 2)}
                  title="Sort Descendingly"
                  class="sort_d"
                >
                  <CgArrowDownR size={17} />
                </Link>
              )}
            </th>
            <th>Status</th>
            <th class="text-center">Actons</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item, index) => (
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{item.customerEmail}</td>
              <td>{item.customerNumber}</td>
              <td>{sliceDate(item.orderDate)}</td>
              <td>PKR {item.orderTotal}</td>
              <td>{item.orderStatus}</td>
              <td class="text-center">
                <Link
                  title="Order Details"
                  class="btn btn-outline-info mr-2 "
                  to={`/orders/orderdetails/${item._id}`}
                  id={"order-details-button-" + (index + 1).toString()}
                >
                  <BiDetail />
                </Link>
                <Link
                  onClick={() => deliverConfirmation(item._id)}
                  title="Deliver"
                  class="btn btn-outline-success mr-2"
                  id={"deliver-order-button-" + (index + 1).toString()}
                >
                  <FaCheckCircle />
                </Link>
                <Link
                  onClick={() => deleteConfirmation(item._id)}
                  title="Delete Order"
                  class="btn btn-outline-danger"
                  id={"delete-order-button-" + (index + 1).toString()}
                >
                  <AiFillDelete />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {isLoading ? (
        <Ring className="spinner" color="#009688" size={50} />
      ) : orders.length !== 0 ? (
        <div></div>
      ) : (
        <div className="order-not-found-orders"> Sorry, no order found</div>
      )}

      {type === "order" ? (
        <DeleteConfirmation
          type={type}
          displayModal={displayConfirmationModal}
          confirmModal={deleteOrder}
          cancelModal={hideConfirmationModal}
          message={confirmationMessage}
          id={orderID}
        />
      ) : (
        <DeliverConfirmation
          type={type}
          displayModal={displayConfirmationModal}
          confirmModal={deliverOrder}
          cancelModal={hideConfirmationModal}
          message={confirmationMessage}
          id={orderID}
        />
      )}
    </div>
  );
};

export default Orders;
