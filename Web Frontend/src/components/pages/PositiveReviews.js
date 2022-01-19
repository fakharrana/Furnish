import React, { useState, useLayoutEffect } from "react";
import { Table, Col, Row } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { CgArrowUpR } from "react-icons/cg";
import { CgArrowDownR } from "react-icons/cg";
import { Link, useHistory } from "react-router-dom";
import { Ring } from "react-spinners-css";
import { toast } from "react-toastify";
import axios from "axios";
import "./style/positiveReviews.css";
import DeleteConfirmation from "./../confirmations/DeleteConfirmation";

const PositiveReviews = (props) => {
  const [data, setData] = useState([]);
  const [searchedProductName, setSearchedProductName] = useState("");
  const [searchedDate, setSearchedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [reviewID, setReviewID] = useState("");
  const [type, setType] = useState("");
  const [getSorting, setSorting] = useState([-1, -1]);
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
      getPositiveReviews();
    }
    // eslint-disable-next-line
  }, [refresh]);

  //Function for slicing date
  const sliceDate = (date) => {
    const slicedDate = date.slice(8, 10) + date.slice(4, 8) + date.slice(0, 4);
    return slicedDate;
  };

  //Function for filtering positive reviews by date analyzed or product name
  let reviews = data.filter((item) => {
    return (
      item.productName
        .toLowerCase()
        .includes(searchedProductName.toLowerCase().trim()) &&
      sliceDate(item.dateAnalyzed)
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

  //Function for retrieving positive reviews/data from server
  const getPositiveReviews = async () => {
    try {
      await authAxios.get("/positivereviews").then(
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
      toast.error("Error: Failed to retrieve reviews", {
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
      reviews = data.sort(function (a, b) {
        if (fieldName === "productName") {
          return a.productName.localeCompare(b.productName);
        } else {
          return a.dateAnalyzed.localeCompare(b.dateAnalyzed);
        }
      });
    } else {
      temp[index] = -1;
      setSorting(temp);
      reviews = data.sort(function (a, b) {
        if (fieldName === "productName") {
          return b.productName.localeCompare(a.productName);
        } else {
          return b.dateAnalyzed.localeCompare(a.dateAnalyzed);
        }
      });
    }
  };

  // Function for displaying the delete confirmation modal
  const deleteConfirmation = (id) => {
    if (id === "deleteall") {
      setType("deleteall");
      setConfirmationMessage("Are you sure you want to delete all reviews?");
      setDisplayConfirmationModal(true);
    } else {
      setType("review");
      setReviewID(id);
      setConfirmationMessage("Are you sure you want to delete the review?");
      setDisplayConfirmationModal(true);
    }
  };

  // Function to hide the delete confirmation modal
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  //Function for deleting positive review
  const deleteReview = async (reviewID) => {
    try {
      await authAxios.delete(`/positivereviews/deletereview/${reviewID}`).then(
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
      toast.error("Error: Failed to delete review", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
    setDisplayConfirmationModal(false);
  };

  //Function for deleting all positive reviews
  const deleteAllReviews = async () => {
    try {
      await authAxios.delete("/positivereviews/deleteallreviews").then(
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
      toast.error("Error: Failed to delete reviews", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
    setDisplayConfirmationModal(false);
  };

  return (
    <div className="positive-reviews">
      <Row className="top-row-positive-reviews">
        <Col>
          <h4 className="top-row-title-positive-reviews">
            <b>Positive Reviews ({data.length})</b>
          </h4>
        </Col>
        <Col>
          <input
            id="filter-by-product-name"
            className="search-bar-positive-reviews shadow "
            type="text"
            placeholder="Filter by product name"
            onChange={(e) => setSearchedProductName(e.target.value)}
          />
        </Col>
        <Col>
          <input
            id="filter-by-analyzed-date"
            className="search-bar-positive-reviews shadow "
            type="text"
            placeholder="Filter by analyzed date"
            onChange={(e) => setSearchedDate(e.target.value)}
          />
        </Col>
        <Col>
          <Link
            onClick={() => deleteConfirmation("deleteall")}
            className="btn btn-danger deleteAll-positive-reviews"
          >
            Delete All
          </Link>
        </Col>
      </Row>

      <Table hover className="shadow" size="sm">
        <thead className="thead-positive-reviews">
          <tr>
            <th>#</th>
            <th>
              Product Name
              {getSorting[0] === -1 ? (
                <Link
                  onClick={() =>
                    sortAlphabetically("ascending", 0, "productName")
                  }
                  title="Sort Ascendingly"
                  class="sort_a"
                >
                  <CgArrowUpR size={17} />
                </Link>
              ) : (
                <Link
                  onClick={() =>
                    sortAlphabetically("descending", 0, "productName")
                  }
                  title="Sort Descendingly"
                  class="sort_d"
                >
                  <CgArrowDownR size={17} />
                </Link>
              )}
            </th>
            <th>Review</th>
            <th>
              Analyzed
              {getSorting[1] === -1 ? (
                <Link
                  onClick={() =>
                    sortAlphabetically("ascending", 1, "dateAnalyzed")
                  }
                  title="Sort Ascendingly"
                  class="sort_a"
                >
                  <CgArrowUpR size={17} />
                </Link>
              ) : (
                <Link
                  onClick={() =>
                    sortAlphabetically("descending", 1, "dateAnalyzed")
                  }
                  title="Sort Descendingly"
                  class="sort_d"
                >
                  <CgArrowDownR size={17} />
                </Link>
              )}
            </th>
            <th class="text-center">Actons</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((item, index) => (
            <tr>
              <th scope="row">{index + 1}</th>
              <td class="w-25">{item.productName}</td>
              <td class="w-50">{item.review}</td>
              <td class="w-25"> {sliceDate(item.dateAnalyzed)}</td>
              <td class="w-25 text-center">
                <Link
                  id={"delete-review-button-" + (index + 1).toString()}
                  title="Delete Review"
                  class="btn btn-outline-danger ml-3 mr-3 "
                  onClick={() => deleteConfirmation(item._id)}
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
      ) : reviews.length !== 0 ? (
        <div></div>
      ) : (
        <div className="review-not-found-positive-reviews">
          {" "}
          Sorry, no review found
        </div>
      )}

      <DeleteConfirmation
        type={type}
        displayModal={displayConfirmationModal}
        confirmModal={deleteReview}
        cancelModal={hideConfirmationModal}
        message={confirmationMessage}
        id={reviewID}
        deleteAll={deleteAllReviews}
      />
    </div>
  );
};

export default PositiveReviews;
