import React, { useState, useLayoutEffect } from "react";
import { Col, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import "./style/forgotPassword.css";

const ForgotPassword = () => {
  const [getEmail, setEmail] = useState("");

  const history = useHistory();

  //Hook for loading and re-loading data
  useLayoutEffect(() => {
    const getAccessToken = localStorage.getItem(
      process.env.REACT_APP_ACCESS_TOKEN
    );
    if (getAccessToken !== null) {
      history.push("/");
    } else {
    }
    // eslint-disable-next-line
  }, []);

  //Function for resetting password
  const resetPassword = async (e) => {
    e.preventDefault();

    if (getEmail) {
      let body = {
        email: getEmail,
      };
      try {
        await axios
          .put("http://localhost:4000/users/forgotpassword", body)
          .then(function (response) {
            if (!response.data.Error) {
              toast.success(response.data.Success, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
              });
              history.push("/login");
            } else {
              toast.error(response.data.Error, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
              });
            }
          });
      } catch (error) {
        toast.error("Error: Unable to reset password", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    } else {
      e.target.value = null;
      toast.error("Please enter your email", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <>
      <div className="header-forgotpassword">
        <Link className="title-forgotpassword" to="/login">
          FURNISH
        </Link>
      </div>
      <div className="forgotpassword shadow">
        <h4 className="form-header-forgotpassword">
          <b>Forgot Password</b>
        </h4>
        <Form className="form-forgotpassword">
          <Form.Row>
            <Form.Group as={Col} controlId="email-id">
              <Form.Label className="label">Email</Form.Label>
              <Form.Control
                className="shadow w-75"
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
          </Form.Row>

          <Button
            className="btn btn-success button-forgotpassword  shadow"
            type="submit"
            onClick={resetPassword}
          >
            Send Email
          </Button>
        </Form>
      </div>
    </>
  );
};

export default ForgotPassword;
