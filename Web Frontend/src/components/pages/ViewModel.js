import React, { useState, useLayoutEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./style/viewmodel.css";

const ViewModel = (props) => {
  const [getProductName, setProductName] = useState("");
  const [getProductModel, setProductModel] = useState(null);

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
      getModel();
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

  //Function for getting model data
  const getModel = async () => {
    try {
      await authAxios.get(`/products/${productid}`).then(
        function (response) {
          const data = response.data;
          setProductName(data.productName);
          setProductModel(data.productModel);
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

  return (
    <div className="viewmodel">
      <Row className="top-row-viewmodel">
        <Col>
          <h4>
            <b>Model {"-> ( " + getProductName + " )"}</b>
          </h4>
        </Col>
      </Row>

      <model-viewer
        src={`http://localhost:4000/products/model/${getProductModel}`}
        auto-rotate
        shadow-intensity="4"
        interaction-prompt="auto"
        camera-controls
      ></model-viewer>
    </div>
  );
};

export default ViewModel;
