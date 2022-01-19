import React, { useState, useLayoutEffect } from "react";
import { Table, Col, Row } from "react-bootstrap";
import { BiDetail } from "react-icons/bi";
import { CgArrowUpR } from "react-icons/cg";
import { CgArrowDownR } from "react-icons/cg";
import { Link, useHistory } from "react-router-dom";
import { Ring } from "react-spinners-css";
import { toast } from "react-toastify";
import axios from "axios";
import "./style/delivered.css";
import DeleteConfirmation from "./../confirmations/DeleteConfirmation";

const Delivered = (props) => {
  const [data, setData] = useState([]);
  const [searchedEmail, setSearchedEmail] = useState("");
  const [searchedDate, setSearchedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
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
      getDeliveredOrders();
    }
    // eslint-disable-next-line
  }, [refresh]);

  //Function for slicing date
  const sliceDate = (date) => {
    const slicedDate = date.slice(8, 10) + date.slice(4, 8) + date.slice(0, 4);
    return slicedDate;
  };

  //Function for filtering delivered orders by deliver date or customer email
  let orders = data.filter((item) => {
    return (
      item.customerEmail
        .toLowerCase()
        .includes(searchedEmail.toLowerCase().trim()) &&
      sliceDate(item.deliverDate)
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

  //Function for getting all delivered orders
  const getDeliveredOrders = async () => {
    try {
      await authAxios.get("/orders/deliveredorders").then(
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
          return a.deliverDate.localeCompare(b.deliverDate);
        }
      });
    } else {
      temp[index] = -1;
      setSorting(temp);
      orders = data.sort(function (a, b) {
        if (fieldName === "customerEmail") {
          return b.customerEmail.localeCompare(a.customerEmail);
        } else {
          return b.deliverDate.localeCompare(a.deliverDate);
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

  // Function for displaying the delete confirmation modal
  const deleteConfirmation = (id) => {
    setConfirmationMessage(
      "Are you sure you want to delete all delivered orders?"
    );
    setDisplayConfirmationModal(true);
  };

  // Function to hide the modal
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  //Function for deleting all delivered orders
  const deleteAllDeliveredOrders = async () => {
    try {
      await authAxios.delete("/orders/deleteallorders").then(
        function (response) {
          console.log(response);
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
      toast.error("Error: Failed to delete orders", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
    setDisplayConfirmationModal(false);
  };

  return (
    <div className="delivered">
      <Row className="top-row-delivered">
        <Col>
          <h4 className="top-row-title-delivered">
            <b>Delivered Orders ({data.length})</b>
          </h4>
        </Col>
        <Col>
          <input
            id="filter-by-email"
            className="search-bar-delivered shadow "
            type="text"
            placeholder="Filter orders by customer email"
            onChange={(e) => setSearchedEmail(e.target.value)}
          />
        </Col>
        <Col>
          <input
            id="filter-by-date"
            className="search-bar-delivered shadow "
            type="text"
            placeholder="Filter orders by delivered date"
            onChange={(e) => setSearchedDate(e.target.value)}
          />
        </Col>
        <Col>
          <Link
            onClick={() => deleteConfirmation()}
            className="btn btn-danger deleteAll-delivered"
          >
            Delete All
          </Link>
        </Col>
      </Row>

      <Table hover className="shadow" size="sm">
        <thead className="thead-delivered">
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
              Deliver Date
              {getSorting[1] === -1 ? (
                <Link
                  onClick={() =>
                    sortAlphabetically("ascending", 1, "deliverDate")
                  }
                  title="Sort Ascendingly"
                  class="sort_a"
                >
                  <CgArrowUpR size={17} />
                </Link>
              ) : (
                <Link
                  onClick={() =>
                    sortAlphabetically("descending", 1, "deliverDate")
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
              <td>{sliceDate(item.deliverDate)}</td>
              <td>PKR {item.orderTotal}</td>
              <td>{item.orderStatus}</td>
              <td class="text-center">
                <Link
                  title="Order Details"
                  class="btn btn-outline-info mr-3 ml-3 "
                  to={`/deliveredorders/orderdetails/${item._id}`}
                >
                  <BiDetail />
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
        <div className="order-not-found-delivered"> Sorry, no order found</div>
      )}

      <DeleteConfirmation
        type="deleteall"
        displayModal={displayConfirmationModal}
        cancelModal={hideConfirmationModal}
        message={confirmationMessage}
        deleteAll={deleteAllDeliveredOrders}
      />
    </div>
  );
};

export default Delivered;
