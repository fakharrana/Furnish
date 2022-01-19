import React, { useState, useLayoutEffect } from "react";
import { Table, Col, Row } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { CgArrowUpR } from "react-icons/cg"; 
import { CgArrowDownR } from "react-icons/cg";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Ring } from "react-spinners-css";
import axios from "axios";
import "./style/customers.css";
import DeleteConfirmation from "./../confirmations/DeleteConfirmation";

const Customers = (props) => {
  const [data, setData] = useState([]);
  const [searchedCustomer, setSearchedCustomer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [customerID, setCustomerID] = useState("");
  const [getSorting, setSorting] = useState([-1, -1]);
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const history = useHistory();

  //Hook for loading and re-loading data
  useLayoutEffect(() => {
    const getAccessToken = localStorage.getItem(
      process.env.REACT_APP_ACCESS_TOKEN
    );
    if (getAccessToken === null) {
      history.push("/login");
    } else {
      getCustomers();
    }
    // eslint-disable-next-line
  }, [refresh]);

  //Axios Instance for Authenticated Requests With JWT Token
  const authAxios = new axios.create({
    baseURL: "http://localhost:4000",
    headers: {
      Authorization: `Bearer ${localStorage.getItem(
        process.env.REACT_APP_ACCESS_TOKEN
      )}`,
    },
  });

  //Function for filtering customers by email
  let customers = data.filter((item) => {
    return item.email
      .toLowerCase()
      .includes(searchedCustomer.toLowerCase().trim());
  });

  //Function for retrieving all customers from server
  const getCustomers = async () => {
    try {
      authAxios.get("/users").then(
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
      toast.error("Error: Un-authorized", {
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
      customers = data.sort(function (a, b) {
        if (fieldName === "name") {
          return a.name.localeCompare(b.name);
        } else {
          return a.email.localeCompare(b.email);
        }
      });
    } else {
      temp[index] = -1;
      setSorting(temp);
      customers = data.sort(function (a, b) {
        if (fieldName === "name") {
          return b.name.localeCompare(a.name);
        } else {
          return b.email.localeCompare(a.email);
        }
      });
    }
  };

  // Function for displaying the delete confirmation modal
  const deleteConfirmation = (id) => {
    setCustomerID(id);
    setConfirmationMessage(
      `Are you sure you want to delete '${
        data.find((customer) => customer._id === id).email
      }'?`
    );
    setDisplayConfirmationModal(true);
  };

  // Function to hide the modal delete confirmation modal
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  //Function for deleting a specific customer
  const deleteCustomer = (userID) => {
    try {
      authAxios.delete(`/users/${userID}`).then(
        function (response) {
          console.log(response.data);
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
      toast.error("Error: Un-authorized", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
    setDisplayConfirmationModal(false);
  };

  return (
    <div className="customers">
      <Row className="top-row-customers">
        <Col>
          <h4>
            <b>Customers ({data.length})</b>
          </h4>
        </Col>
        <Col>
          <input
            id="filter-by-email"
            className="search-bar-customers shadow "
            type="text"
            placeholder="Filter customers by email"
            onChange={(e) => setSearchedCustomer(e.target.value)}
          />
        </Col>
      </Row>

      <Table hover className="shadow" size="sm">
        <thead className="thead-customers">
          <tr>
            <th>#</th>
            <th>
              Name
              {getSorting[0] === -1 ? (
                <Link
                  onClick={() => sortAlphabetically("ascending", 0, "name")}
                  title="Sort Ascendingly"
                  class="sort_a"
                >
                  <CgArrowUpR size={17} />
                </Link>
              ) : (
                <Link
                  onClick={() => sortAlphabetically("descending", 0, "name")}
                  title="Sort Descendingly"
                  class="sort_d"
                >
                  <CgArrowDownR size={17} />
                </Link>
              )}
            </th>
            <th>
              Email Address
              {getSorting[1] === -1 ? (
                <Link
                  onClick={() => sortAlphabetically("ascending", 1, "email")}
                  title="Sort Ascendingly"
                  class="sort_a"
                >
                  <CgArrowUpR size={17} />
                </Link>
              ) : (
                <Link
                  onClick={() => sortAlphabetically("descending", 1, "email")}
                  title="Sort Descendingly"
                  class="sort_d"
                >
                  <CgArrowDownR size={17} />
                </Link>
              )}
            </th>
            <th>Actons</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((item, index) => (
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>
                <Link
                  onClick={() => deleteConfirmation(item._id)}
                  title="Delete Customer"
                  class="btn btn-outline-danger mr-2"
                  id={"delete-customer-button-" + (index + 1).toString()}
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
      ) : customers.length !== 0 ? (
        <div></div>
      ) : (
        <div className="order-not-found-customers">
          {" "}
          Sorry, no customer found
        </div>
      )}

      <DeleteConfirmation
        type="order"
        displayModal={displayConfirmationModal}
        confirmModal={deleteCustomer}
        cancelModal={hideConfirmationModal}
        message={confirmationMessage}
        id={customerID}
      />
    </div>
  );
};

export default Customers;
