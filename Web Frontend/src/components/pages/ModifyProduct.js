import React, { useState, useLayoutEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Ring } from "react-spinners-css";
import axios from "axios";
import "./style/modifyProduct.css";

const ModifyProduct = (props) => {
  const [getProductName, setProductName] = useState("");
  const [getProductCategory, setProductCategory] = useState("");
  const [getProductDescription, setProductDescription] = useState("");
  const [getProductPrice, setProductPrice] = useState();
  const [getProductQuantity, setProductQuantity] = useState();
  const [getProductThumbnail, setProductThumbnail] = useState(null);
  const [getProductImages, setProductImages] = useState([]);
  const [getProductModel, setProductModel] = useState(null);
  const [getThumbnailLabel, setThumbnailLabel] = useState("1 file stored");
  const [getImagesLabel, setImagesLabel] = useState("3 files stored");
  const [getModelLabel, setModelLabel] = useState("1 file stored");
  const [getNewFileAdded, setNewFileAdded] = useState([0, 0, 0]);
  const [getOldFileNames, setOldFileNames] = useState([]);
  const [getNameError, setNameError] = useState(false);
  const [getCategoryError, setCategoryError] = useState(false);
  const [getDescriptionError, setDescriptionError] = useState(false);
  const [getPriceError, setPriceError] = useState(false);
  const [getQuantityError, setQuantityError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const params = useParams();
  const productid = params.id;

  //Hook for loading and re-loading data
  useLayoutEffect(() => {
    const getAccessToken = localStorage.getItem(
      process.env.REACT_APP_ACCESS_TOKEN
    );
    if (getAccessToken === null) {
      history.push("/login");
    } else {
      getProductData();
    }
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

  //Function for retrieving product data from server
  const getProductData = async () => {
    try {
      await authAxios.get(`/products/${productid}`).then(
        function (response) {
          const data = response.data;
          setProductName(data.productName);
          setProductCategory(data.productCategory);
          setProductDescription(data.productDescription);
          setProductPrice(data.productPrice);
          setProductQuantity(data.productQuantity);
          setProductThumbnail(data.productThumbnail);
          setProductImages(data.productImages);
          setProductModel(data.productModel);
          setOldFileNames([
            data.productThumbnail,
            data.productImages[0],
            data.productImages[1],
            data.productImages[2],
            data.productModel,
          ]);
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
      toast.error("Error: Failed to retrieve product data", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  //Function for validating product name
  const checkProductName = (e) => {
    const name = e.target.value;
    if (name !== "") {
      setNameError(false);
      setProductName(name);
    } else {
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
    } else {
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
      setProductThumbnail(file);
      setThumbnailLabel(file.name);
      var temp = getNewFileAdded;
      temp[0] = 1;
      setNewFileAdded(temp);
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
      setProductImages(files);
      setImagesLabel(files[0].name + "," + files[1].name + "," + files[2].name);
      var temp = getNewFileAdded;
      temp[1] = 1;
      setNewFileAdded(temp);
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
      setProductModel(file);
      setModelLabel(file.name);
      var temp = getNewFileAdded;
      temp[2] = 1;
      setNewFileAdded(temp);
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

  //Function for sending data to the server
  const sendProductData = async (productData) => {
    try {
      await authAxios.put("/products/modifyproduct", productData).then(
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
            console.log(error.response.status);
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
      toast.error("Error: Failed to modify product details", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  //Function for modifying product details
  const modifyProduct = (e) => {
    e.preventDefault();
    var files = [];
    const validate = validateData();

    if (validate) {
      setIsLoading(true);
      var productData = new FormData();
      productData.append("productid", productid);
      productData.append("productName", getProductName);
      productData.append("productCategory", getProductCategory);
      productData.append("productDescription", getProductDescription);
      productData.append("productPrice", getProductPrice);
      productData.append("productQuantity", getProductQuantity);

      if (getNewFileAdded[0] + getNewFileAdded[1] + getNewFileAdded[2] === 0) {
        const changed = {
          productText: true,
          productThumbnail: false,
          productImages: false,
          productModel: false,
        };
        productData.append("changed", JSON.stringify(changed));
        sendProductData(productData);
      } else if (
        getNewFileAdded[0] === 1 &&
        getNewFileAdded[1] === 0 &&
        getNewFileAdded[2] === 0
      ) {
        var changed = {
          productText: true,
          productThumbnail: true,
          productImages: false,
          productModel: false,
        };
        console.log("Changed files 1 0 0 " + files);
        productData.append("changed", JSON.stringify(changed));
        productData.append("files", getProductThumbnail);
        productData.append("oldFiles", getOldFileNames[0]);
        sendProductData(productData);
      } else if (
        getNewFileAdded[0] === 0 &&
        getNewFileAdded[1] === 1 &&
        getNewFileAdded[2] === 0
      ) {
        files = [getProductImages[0], getProductImages[1], getProductImages[2]];
        console.log("Changed files  0 1 0 " + files);

        const changed = {
          productText: true,
          productThumbnail: false,
          productImages: true,
          productModel: false,
        };

        const oldFiles = [
          getOldFileNames[1],
          getOldFileNames[2],
          getOldFileNames[3],
        ];
        productData.append("changed", JSON.stringify(changed));

        for (let i = 0; i < files.length; i++) {
          productData.append("files", files[i]);
        }

        for (let i = 0; i < oldFiles.length; i++) {
          productData.append("oldFiles", oldFiles[i]);
        }
        sendProductData(productData);
      } else if (
        getNewFileAdded[0] === 0 &&
        getNewFileAdded[1] === 0 &&
        getNewFileAdded[2] === 1
      ) {
        console.log("Changed files  0 0 1 " + files);
        const changed = {
          productText: true,
          productThumbnail: false,
          productImages: false,
          productModel: true,
        };
        productData.append("changed", JSON.stringify(changed));
        productData.append("files", getProductModel);
        productData.append("oldFiles", getOldFileNames[4]);
        sendProductData(productData);
      } else if (
        getNewFileAdded[0] === 1 &&
        getNewFileAdded[1] === 1 &&
        getNewFileAdded[2] === 0
      ) {
        files = [
          getProductThumbnail,
          getProductImages[0],
          getProductImages[1],
          getProductImages[2],
        ];
        console.log("Changed files 1 1 0 " + files);

        const changed = {
          productText: true,
          productThumbnail: true,
          productImages: true,
          productModel: false,
        };

        const oldFiles = [
          getOldFileNames[0],
          getOldFileNames[1],
          getOldFileNames[2],
          getOldFileNames[3],
        ];
        productData.append("changed", JSON.stringify(changed));

        for (let i = 0; i < files.length; i++) {
          productData.append("files", files[i]);
        }

        for (let i = 0; i < oldFiles.length; i++) {
          productData.append("oldFiles", oldFiles[i]);
        }

        sendProductData(productData);
      } else if (
        getNewFileAdded[0] === 0 &&
        getNewFileAdded[1] === 1 &&
        getNewFileAdded[2] === 1
      ) {
        files = [
          getProductImages[0],
          getProductImages[1],
          getProductImages[2],
          getProductModel,
        ];
        console.log("Changed files 0 1 1 " + files);

        const changed = {
          productText: true,
          productThumbnail: false,
          productImages: true,
          productModel: true,
        };

        const oldFiles = [
          getOldFileNames[1],
          getOldFileNames[2],
          getOldFileNames[3],
          getOldFileNames[4],
        ];
        productData.append("changed", JSON.stringify(changed));

        for (let i = 0; i < files.length; i++) {
          productData.append("files", files[i]);
        }

        for (let i = 0; i < oldFiles.length; i++) {
          productData.append("oldFiles", oldFiles[i]);
        }

        sendProductData(productData);
      } else if (
        getNewFileAdded[0] === 1 &&
        getNewFileAdded[1] === 0 &&
        getNewFileAdded[2] === 1
      ) {
        files = [getProductThumbnail, getProductModel];
        console.log("Changed files 1 0 1 " + files);

        const changed = {
          productText: true,
          productThumbnail: true,
          productImages: false,
          productModel: true,
        };
        const oldFiles = [getOldFileNames[0], getOldFileNames[4]];
        productData.append("changed", JSON.stringify(changed));

        for (let i = 0; i < files.length; i++) {
          productData.append("files", files[i]);
        }

        for (let i = 0; i < oldFiles.length; i++) {
          productData.append("oldFiles", oldFiles[i]);
        }
        sendProductData(productData);
      } else if (
        getNewFileAdded[0] === 1 &&
        getNewFileAdded[1] === 1 &&
        getNewFileAdded[2] === 1
      ) {
        files = [
          getProductThumbnail,
          getProductImages[0],
          getProductImages[1],
          getProductImages[2],
          getProductModel,
        ];
        console.log("Changed files 0 1 1 " + files);

        const changed = {
          productText: true,
          productThumbnail: true,
          productImages: true,
          productModel: true,
        };
        productData.append("changed", JSON.stringify(changed));

        for (let i = 0; i < files.length; i++) {
          productData.append("files", files[i]);
        }

        for (let i = 0; i < getOldFileNames.length; i++) {
          productData.append("oldFiles", getOldFileNames[i]);
        }
        sendProductData(productData);
      } else {
        console.log("No condition matched");
      }
    }
  };

  return (
    <div className="modifyproduct">
      <h3>
        <b>Modify Product</b>
      </h3>
      <Form className="form-modifyproduct" encType="multipart/form-data">
        <Form.Row>
          <Form.Group as={Col} controlId="product-name">
            <Form.Label className="label">Product Name</Form.Label>
            <Form.Control
              value={getProductName}
              onChange={(e) => checkProductName(e)}
              type="text"
              placeholder="Enter product name"
              className={getNameError ? "Input" : ""}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="product-category">
            <Form.Label className="label">Product Category</Form.Label>
            <Form.Control
              value={getProductCategory}
              onChange={(e) => checkProductCategory(e)}
              as="select"
              className={getCategoryError ? "Input" : ""}
            >
              <option selected={getProductCategory === "Bed" ? true : false}>
                Bed
              </option>
              <option selected={getProductCategory === "Table" ? true : false}>
                Table
              </option>
              <option selected={getProductCategory === "Sofa" ? true : false}>
                Sofa
              </option>
              <option selected={getProductCategory === "Chair" ? true : false}>
                Chair
              </option>
              <option selected={getProductCategory === "Desk" ? true : false}>
                Desk
              </option>
            </Form.Control>
          </Form.Group>
        </Form.Row>

        <Form.Group controlId="product-description">
          <Form.Label className="label">Product Description</Form.Label>
          <Form.Control
            value={getProductDescription}
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
              value={getProductPrice}
              onChange={(e) => checkPrice(e)}
              type="number"
              placeholder="Enter product price"
              className={getPriceError ? "Input" : ""}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="product-quantity">
            <Form.Label className="label">Product Quantity</Form.Label>
            <Form.Control
              value={getProductQuantity}
              onChange={(e) => checkQuantity(e)}
              type="number"
              placeholder="Enter product quantity"
              className={getQuantityError ? "Input" : ""}
            />
          </Form.Group>
        </Form.Row>

        <Form.Row className="bottom-row-modifyproduct">
          <Form.Group as={Col} controlId="thumbnail">
            <Form.File
              onChange={(e) => checkThumbnail(e)}
              label="Upload thumbnail"
              className="label-files-modifyproduct"
            />
            <Form.Label
              title={getProductThumbnail}
              className="label-thumbnail-modifyproduct"
            >
              {getThumbnailLabel}
            </Form.Label>
          </Form.Group>

          <Form.Group as={Col} controlId="images">
            <Form.File
              onChange={(e) => checkImages(e)}
              label="Upload images"
              multiple
              className="label-files-modifyproduct"
            />
            <Form.Label
              title={getProductImages}
              className="label-images-modifyproduct"
            >
              {getImagesLabel}
            </Form.Label>
          </Form.Group>

          <Form.Group as={Col} controlId="model">
            <Form.File
              accept=".glb"
              onChange={(e) => checkModel(e)}
              label="Upload model"
              className="label-files-modifyproduct"
            />
            <Form.Label
              title={getProductModel}
              className="label-model-modifyproduct"
            >
              {getModelLabel}
            </Form.Label>
          </Form.Group>

          <Form.Group
            as={Col}
            controlId="button"
            className="save-button-modifyproduct"
          >
            <Button
              onClick={(e) => modifyProduct(e)}
              variant="success"
              type="submit"
              id="modify-product-button"
            >
              Modify Product
            </Button>
          </Form.Group>
        </Form.Row>
      </Form>
    </div>
  );
};

export default ModifyProduct;
