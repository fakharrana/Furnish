import React, { useState, useLayoutEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Ring } from "react-spinners-css";
import axios from "axios";
import "./style/addNewProduct.css";

const AddNewProduct = (props) => {
  const [getProductName, setProductName] = useState("");
  const [getProductCategory, setProductCategory] = useState("");
  const [getProductDescription, setProductDescription] = useState("");
  const [getProductPrice, setProductPrice] = useState(0);
  const [getProductQuantity, setProductQuantity] = useState(0);
  const [getProductThumbnail, setProductThumbnail] = useState(null);
  const [getProductImages, setProductImages] = useState(null);
  const [getProductModel, setProductModel] = useState(null);
  const [getProducts, setProducts] = useState(null);
  const [getNameError, setNameError] = useState(false);
  const [getCategoryError, setCategoryError] = useState(false);
  const [getDescriptionError, setDescriptionError] = useState(false);
  const [getPriceError, setPriceError] = useState(false);
  const [getQuantityError, setQuantityError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  //Hook for loading and re-loading data
  useLayoutEffect(() => {
    const getAccessToken = localStorage.getItem(
      process.env.REACT_APP_ACCESS_TOKEN
    );
    if (getAccessToken === null) {
      history.push("/login");
    }
    getProductList();
    // eslint-disable-next-line
  }, []);

  //Axios Instance for Authenticated Requests With JWT Token
  const authAxios = new axios.create({
    baseURL: "http://localhost:4000",
    headers: {
      Authorization: `Bearer ${localStorage.getItem(
        process.env.REACT_APP_ACCESS_TOKEN
      )}`,
    },
  });

  //Function for retrieving product list
  const getProductList = async () => {
    try {
      await authAxios.get("/products").then(
        function (response) {
          let productlist = [];
          for (let i = 0; i < response.data.length; i++) {
            productlist.push(response.data[i].productName.toLowerCase());
          }
          setProducts(productlist);
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
      toast.error("Error: Failed to retrieve product list", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  //Function for validating product name
  const checkProductName = (e) => {
    const name = e.target.value;
    if (getProducts.includes(name.toLowerCase().trim())) {
      toast.error("A product with this name already exists", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      e.target.value = null;
    } else {
      setNameError(false);
      setProductName(name);
    }
  };

  //Function for validating product category
  const checkProductCategory = (e) => {
    const category = e.target.value;
    if (category !== "") {
      setCategoryError(false);
      setProductCategory(category);
    }
  };

  //Function for validating product description
  const checkProductDescription = (e) => {
    const description = e.target.value;
    if (description !== "") {
      setDescriptionError(false);
      setProductDescription(description);
    }
  };

  //Function for validating product price
  const checkPrice = (e) => {
    const price = e.target.value;
    if (parseInt(price) < 1) {
      toast.error("Product price cannot be negative or less than zero", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      e.target.value = null;
    } else {
      setPriceError(false);
      setProductPrice(price);
    }
  };

  //Function for validating product quantity
  const checkQuantity = (e) => {
    const quantity = e.target.value;
    if (parseInt(quantity) < 1) {
      toast.error("Product quantity cannot be negative or less than zero", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      e.target.value = null;
    } else {
      setQuantityError(false);
      setProductQuantity(quantity);
    }
  };

  //Function for validating product thumbnail
  const checkThumbnail = (e) => {
    const file = e.target.files[0];
    if (
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "image/jpeg"
    ) {
      setProductThumbnail(e.target.files[0]);
    } else {
      toast.error("Thumbnail can only be in jpg, jpeg, or png format", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      e.target.value = null;
    }
  };

  //Function for checking product image type
  const imageType = (file) => {
    if (file === "image/png" || file === "image/jpg" || file === "image/jpeg") {
      return true;
    }

    return false;
  };

  //Function for validating product images
  const checkImages = (e) => {
    const files = e.target.files;
    if (files.length > 3 || files.length < 3) {
      toast.error("Only 3 images are accepted", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      e.target.value = null;
    } else if (
      imageType(files[0].type) &&
      imageType(files[1].type) &&
      imageType(files[2].type)
    ) {
      setProductImages(e.target.files);
    } else {
      toast.error("Images can only be in jpg, jpeg, or png format", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      e.target.value = null;
    }
  };

  //Function for validating product model
  const checkModel = (e) => {
    const file = e.target.files[0];
    const fileExtension = file.name.slice(-4, -1) + file.name.slice(-1);
    if (file.type === "model/glb" || fileExtension === ".glb") {
      setProductModel(e.target.files[0]);
    } else {
      toast.error("Model can only be in glb format", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      e.target.value = null;
    }
  };

  //Function for validation of product details on form submission
  const validateData = () => {
    if (!getProductName) {
      setNameError(true);
    }

    if (!getProductCategory) {
      setCategoryError(true);
    }

    if (!getProductDescription) {
      setDescriptionError(true);
    }

    if (!getProductPrice) {
      setPriceError(true);
    }

    if (!getProductQuantity) {
      setQuantityError(true);
    }

    if (
      !getProductName ||
      !getProductCategory ||
      !getProductDescription ||
      !getProductPrice
    ) {
      toast.error("Kindly fill the required details", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });

      return false;
    }

    if (
      getProductName !== "" &&
      getProductCategory !== "" &&
      getProductDescription !== "" &&
      getProductPrice !== 0 &&
      getProductQuantity !== 0 &&
      (!getProductThumbnail || !getProductImages || !getProductModel)
    ) {
      toast.error("Kindly upload the required files", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });

      return false;
    }

    return true;
  };

  //Function for adding new product
  const addNewProduct = async (e) => {
    e.preventDefault();
    const validate = validateData();

    if (validate) {
      setIsLoading(true);
      const files = [
        getProductThumbnail,
        getProductImages[0],
        getProductImages[1],
        getProductImages[2],
        getProductModel,
      ];

      let productData = new FormData();
      productData.append("productName", getProductName);
      productData.append("productCategory", getProductCategory);
      productData.append("productDescription", getProductDescription);
      productData.append("productPrice", getProductPrice);
      productData.append("productQuantity", getProductQuantity);

      for (let i = 0; i < files.length; i++) {
        productData.append("files", files[i]);
      }

      try {
        await authAxios.post("/products/addproduct", productData).then(
          function (response) {
            setIsLoading(false);
            toast.success(response.data.Success, {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: true,
            });
            history.push("/products");
          },
          function (error) {
            setIsLoading(false);
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
        setIsLoading(false);
        toast.error("Error: Failed to add product", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    }
  };

  return (
    <div className="addnewproduct">
      <h3>
        <b>Add New Product</b>
      </h3>
      <Form className="form-addnewproduct" encType="multipart/form-data">
        <Form.Row>
          <Form.Group as={Col} controlId="product-name">
            <Form.Label className="label">Product Name</Form.Label>
            <Form.Control
              onChange={(e) => checkProductName(e)}
              type="text"
              placeholder="Enter product name"
              className={getNameError ? "Input" : ""}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="product-category">
            <Form.Label className="label">Product Category</Form.Label>
            <Form.Control
              onChange={(e) => checkProductCategory(e)}
              as="select"
              className={getCategoryError ? "Input" : ""}
            >
              <option value="" disabled selected hidden>
                Choose product category
              </option>
              <option>Bed</option>
              <option>Table</option>
              <option>Sofa</option>
              <option>Chair</option>
              <option>Desk</option>
            </Form.Control>
          </Form.Group>
        </Form.Row>

        <Form.Group controlId="product-description">
          <Form.Label className="label">Product Description</Form.Label>

          <Form.Control
            onChange={(e) => checkProductDescription(e)}
            as="textarea"
            rows="8"
            placeholder="Enter product description...."
            className={getDescriptionError ? "Input" : ""}
          />
          {isLoading ? (
            <Ring className="spinner-addnewproduct" color="#009688" size={50} />
          ) : (
            <></>
          )}
        </Form.Group>

        <Form.Row>
          <Form.Group as={Col} controlId="product-price">
            <Form.Label className="label">Product Price</Form.Label>
            <Form.Control
              onChange={(e) => checkPrice(e)}
              type="number"
              placeholder="Enter product price"
              className={getPriceError ? "Input" : ""}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="product-quantity">
            <Form.Label className="label">Product Quantity</Form.Label>
            <Form.Control
              onChange={(e) => checkQuantity(e)}
              type="number"
              placeholder="Enter product quantity"
              className={getQuantityError ? "Input" : ""}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row className="bottom-row-addnewproduct">
          <Form.Group as={Col} controlId="thumbnail">
            <Form.File
              onChange={(e) => checkThumbnail(e)}
              label="Upload thumbnail"
              className="label"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="images">
            <Form.File
              onChange={(e) => checkImages(e)}
              label="Upload images"
              multiple
              className="label"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="model">
            <Form.File
              accept=".glb"
              onChange={(e) => checkModel(e)}
              label="Upload model"
              className="label"
            />
          </Form.Group>

          <Form.Group
            as={Col}
            controlId="button"
            className="save-button-addnewproduct"
          >
            <Button
              onClick={(e) => addNewProduct(e)}
              variant="success"
              type="submit"
              id="save-product-button"
            >
              Save Product
            </Button>
          </Form.Group>
        </Form.Row>
      </Form>
    </div>
  );
};

export default AddNewProduct;
