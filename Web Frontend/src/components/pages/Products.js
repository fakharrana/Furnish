import React, { useState, useLayoutEffect } from "react";
import { Table, Col, Row, Image } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { CgShapeHexagon } from "react-icons/cg";
import { CgArrowUpR } from "react-icons/cg";
import { CgArrowDownR } from "react-icons/cg";
import { Link, useHistory } from "react-router-dom";
import { Ring } from "react-spinners-css";
import { toast } from "react-toastify";
import axios from "axios";
import "./style/products.css";
import DeleteConfirmation from "./../confirmations/DeleteConfirmation";

const Products = (props) => {
  const [data, setData] = useState([]);
  const [searchedProduct, setSearchedProduct] = useState("");
  const [searchedCategory, setSearchedCategory] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [productDetails, setProductDetails] = useState({});
  const [getSorting, setSorting] = useState([-1, -1, -1, -1, -1, -1]);
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
      getProducts();
    }
    // eslint-disable-next-line
  }, [refresh]);

  //Function for slicing date
  const sliceDate = (date) => {
    const slicedDate = date.slice(8, 10) + date.slice(4, 8) + date.slice(0, 4);
    return slicedDate;
  };

  //Function for filtering products by name or category
  var products = data.filter((item) => {
    return (
      item.productName
        .toLowerCase()
        .includes(searchedProduct.toLowerCase().trim()) &&
      item.productCategory
        .toLowerCase()
        .includes(searchedCategory.toLowerCase().trim())
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

  //Function for retrieving products/data from server
  const getProducts = async () => {
    try {
      await authAxios.get("/products").then(
        function (response) {
          setData(response.data);
          setIsLoading(false);
        },
        function (error) {
          if (error.response.status === 401) {
            toast.error(" Please Log In Again", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: true,
            });
            localStorage.removeItem(process.env.REACT_APP_ACCESS_TOKEN);
            props.redirectPage();
            history.push("/login");
          }
        }
      );
    } catch (err) {
      toast.error("Error: Failed to retrieve products", {
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
      products = data.sort(function (a, b) {
        if (fieldName === "productName") {
          return a.productName.localeCompare(b.productName);
        } else if (fieldName === "productCategory") {
          return a.productCategory.localeCompare(b.productCategory);
        } else {
          return a.dateAdded.localeCompare(b.dateAdded);
        }
      });
    } else {
      temp[index] = -1;
      setSorting(temp);
      products = data.sort(function (a, b) {
        if (fieldName === "productName") {
          return b.productName.localeCompare(a.productName);
        } else if (fieldName === "productCategory") {
          return b.productCategory.localeCompare(a.productCategory);
        } else {
          return b.dateAdded.localeCompare(a.dateAdded);
        }
      });
    }
  };

  // Function for sorting data numerically
  const sortNumerically = (sorting, index, fieldName) => {
    let temp = getSorting;
    if (sorting === "ascending") {
      temp[index] = 1;
      setSorting(temp);
      products = data.sort(function (a, b) {
        if (fieldName === "productPrice") {
          return a.productPrice - b.productPrice;
        } else if (fieldName === "productQuantity") {
          return a.productQuantity - b.productQuantity;
        } else {
          return a.soldQuantity - b.soldQuantity;
        }
      });
    } else {
      temp[index] = -1;
      setSorting(temp);
      products = data.sort(function (a, b) {
        if (fieldName === "productPrice") {
          return b.productPrice - a.productPrice;
        } else if (fieldName === "productQuantity") {
          return b.productQuantity - a.productQuantity;
        } else {
          return b.soldQuantity - a.soldQuantity;
        }
      });
    }
  };

  // Function for displaying the delete confirmation modal
  const deleteConfirmation = (productDetails) => {
    setProductDetails(productDetails);
    setConfirmationMessage(
      `Are you sure you want to delete '${
        data.find((product) => product._id === productDetails.id).productName
      }'?`
    );
    setDisplayConfirmationModal(true);
  };

  // Function to hide the delete confirmation modal
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  //Function for deleting a product
  const deleteProduct = async (
    id,
    thumbnail,
    image1,
    image2,
    image3,
    model
  ) => {
    const productDetails = [id, thumbnail, image1, image2, image3, model];
    console.log(productDetails);
    try {
      await authAxios
        .delete(`/products/${productDetails}`)
        .then(function (response) {
          toast.success(response.data.Success, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
          });
          setRefresh(Math.floor(Math.random() * 1000));
        });
    } catch (err) {
      toast.error("Error: Failed to delete product", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      console.log(err);
    }
    setDisplayConfirmationModal(false);
  };

  return (
    <>
      <div className="products">
        <Row className="top-row-products">
          <Col>
            <h4>
              <b>Products ({data.length})</b>
            </h4>
          </Col>
          <Col>
            <input
              id="filter-by-name"
              className="search-bar-products shadow "
              type="text"
              placeholder="Filter products by name"
              onChange={(e) => setSearchedProduct(e.target.value)}
            />
          </Col>
          <Col>
            <input
              id="filter-by-category"
              className="search-bar-products shadow "
              type="text"
              placeholder="Filter products by category"
              onChange={(e) => setSearchedCategory(e.target.value)}
            />
          </Col>
          <Col>
            <Link
              id="add-product-button"
              className="btn addProduct-products"
              to="/products/addproduct"
            >
              Add Product
            </Link>
          </Col>
        </Row>

        <Table hover className="shadow" size="sm">
          <thead className="thead-products">
            <tr>
              <th>#</th>
              <th class="text-center">Thumbnail</th>
              <th>
                Name
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
              <th>
                Category
                {getSorting[1] === -1 ? (
                  <Link
                    onClick={() =>
                      sortAlphabetically("ascending", 1, "productCategory")
                    }
                    title="Sort Ascendingly"
                    class="sort_a"
                  >
                    <CgArrowUpR size={17} />
                  </Link>
                ) : (
                  <Link
                    onClick={() =>
                      sortAlphabetically("descending", 1, "productCategory")
                    }
                    title="Sort Descendingly"
                    class="sort_d"
                  >
                    <CgArrowDownR size={17} />
                  </Link>
                )}
              </th>
              <th>
                Price
                {getSorting[2] === -1 ? (
                  <Link
                    onClick={() =>
                      sortNumerically("ascending", 2, "productPrice")
                    }
                    title="Sort Ascendingly"
                    class="sort_a"
                  >
                    <CgArrowUpR size={17} />
                  </Link>
                ) : (
                  <Link
                    onClick={() =>
                      sortNumerically("descending", 2, "productPrice")
                    }
                    title="Sort Descendingly"
                    class="sort_d"
                  >
                    <CgArrowDownR size={17} />
                  </Link>
                )}
              </th>
              <th>
                Date Added
                {getSorting[3] === -1 ? (
                  <Link
                    onClick={() =>
                      sortAlphabetically("ascending", 3, "dateAdded")
                    }
                    title="Sort Ascendingly"
                    class="sort_a"
                  >
                    <CgArrowUpR size={17} />
                  </Link>
                ) : (
                  <Link
                    onClick={() =>
                      sortAlphabetically("descending", 3, "dateAdded")
                    }
                    title="Sort Descendingly"
                    class="sort_d"
                  >
                    <CgArrowDownR size={17} />
                  </Link>
                )}
              </th>
              <th class="text-center">
                Quantity
                {getSorting[4] === -1 ? (
                  <Link
                    onClick={() =>
                      sortNumerically("ascending", 4, "productQuantity")
                    }
                    title="Sort Ascendingly"
                    class="sort_a"
                  >
                    <CgArrowUpR size={17} />
                  </Link>
                ) : (
                  <Link
                    onClick={() =>
                      sortNumerically("descending", 4, "productQuantity")
                    }
                    title="Sort Descendingly"
                    class="sort_d"
                  >
                    <CgArrowDownR size={17} />
                  </Link>
                )}
              </th>
              <th class="text-center">
                Sold
                {getSorting[5] === -1 ? (
                  <Link
                    onClick={() =>
                      sortNumerically("ascending", 5, "soldQuantity")
                    }
                    title="Sort Ascendingly"
                    class="sort_a"
                  >
                    <CgArrowUpR size={17} />
                  </Link>
                ) : (
                  <Link
                    onClick={() =>
                      sortNumerically("descending", 5, "soldQuantity")
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
            {products.map((item, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td class="text-center">
                  <Image
                    src={`http://localhost:4000/products/thumbnail/${item.productThumbnail}`}
                    className="thumbnail-products"
                    thumbnail
                    alt={item.productName}
                  />
                </td>
                <td>{item.productName}</td>
                <td>{item.productCategory}</td>
                <td>{"PKR " + item.productPrice}</td>
                <td>{sliceDate(item.dateAdded)}</td>
                <td class="text-center">{item.productQuantity}</td>
                <td class="text-center">{item.soldQuantity}</td>
                <td class="text-center">
                  <Link
                    id={"view-model-button-" + (index + 1).toString()}
                    title="View 3D Model"
                    class="btn btn-outline-info  mr-2"
                    to={`products/viewmodel/${item._id}`}
                  >
                    <CgShapeHexagon />
                  </Link>

                  <Link
                    id={"modify-product-button-" + (index + 1).toString()}
                    title="Modify Details"
                    class="btn btn-outline-success mr-2"
                    to={`products/modifyproduct/${item._id}`}
                  >
                    <FaEdit />
                  </Link>

                  <Link
                    onClick={() =>
                      deleteConfirmation({
                        id: item._id,
                        thumbnail: item.productThumbnail,
                        image1: item.productImages[0],
                        image2: item.productImages[1],
                        image3: item.productImages[2],
                        model: item.productModel,
                      })
                    }
                    title="Delete Product"
                    class="btn btn-outline-danger"
                    id={"delete-product-button-" + (index + 1).toString()}
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
        ) : products.length !== 0 ? (
          <div></div>
        ) : (
          <div className="product-not-found-products">
            {" "}
            Sorry, no product found
          </div>
        )}
      </div>

      <DeleteConfirmation
        type="product"
        displayModal={displayConfirmationModal}
        confirmModal={deleteProduct}
        cancelModal={hideConfirmationModal}
        message={confirmationMessage}
        productDetails={productDetails}
      />
    </>
  );
};

export default Products;
