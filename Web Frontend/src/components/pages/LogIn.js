import React, { useState, useLayoutEffect } from "react";
import { Col, Form, Button } from "react-bootstrap";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import { useHistory, Link } from "react-router-dom";
import * as EmailValidator from "email-validator";
import axios from "axios";
import "./style/logIn.css";

const LogIn = (props) => {
  const [getShowPasword, setShowPassword] = useState(false);
  const [getEmail, setEmail] = useState("");
  const [getPassword, setPassword] = useState("");

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

  //Function to show/hide password
  const showPassword = () => {
    setShowPassword(!getShowPasword);
  };

  //Function for validation on form submit
  const validate = () => {
    if (!getEmail && !getPassword) {
      toast.error("Kindly fill the required details", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return false;
    }

    if (!getEmail) {
      toast.error("Email cannot be empty", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return false;
    }

    if (!getPassword) {
      toast.error("Password cannot be empty", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return false;
    }

    if (!EmailValidator.validate(getEmail)) {
      toast.error("Provide a valid email", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return false;
    }

    return true;
  };

  //Function for logging in
  const logIn = async (e) => {
    e.preventDefault();
    const userData = {
      email: getEmail,
      password: getPassword,
    };

    if (validate()) {
      try {
        await axios.post("http://localhost:4000/users/login", userData).then(
          function (response) {
            //IF Admin login
            if (response.data.user.admin === true) {
              localStorage.setItem(
                process.env.REACT_APP_ACCESS_TOKEN,
                response.data.token
              );
              localStorage.setItem("user", response.data.user);
              toast.success("Successfully logged in", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
              });
              props.redirectPage();
              history.push("/");
            } else {
              toast.error("You are not authorized", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
              });
            }
          },
          //If not registered
          function (error) {
            if (error.response.status === 401) {
              toast.error("Not Registered", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
              });
            }
          }
        );
      } catch (err) {
        toast.error("Server Error", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
        });
      }
    }
  };

  return (
    <>
      <div className="header-login ">
        <p className="title-login ">FURNISH</p>
      </div>
      <div className="login shadow">
        <h3 className="form-header-login">
          <b>Admin</b>
        </h3>
        <Form className="form-login">
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
          <Form.Row>
            <Form.Group as={Col} controlId="password-id">
              <Form.Label className="label">Password</Form.Label>
              <Form.Control
                className="shadow w-75"
                type={getShowPasword ? "text" : "password"}
                placeholder="Enter your password "
                onChange={(e) => setPassword(e.target.value)}
              />{" "}
              <div
                onClick={() => showPassword()}
                className="showpassword-login"
              >
                {getShowPasword ? (
                  <AiFillEyeInvisible size="26px" color="#009688" />
                ) : (
                  <AiFillEye size="26px" color="#009688" />
                )}
              </div>
            </Form.Group>
          </Form.Row>
          <Link className="forget-password-login" to="/forgotpassword">
            Forgot Password?
          </Link>
          <Button
            id="login-button"
            onClick={(e) => logIn(e)}
            className="btn btn-success button-login shadow"
            type="submit"
          >
            Log In
          </Button>
        </Form>
      </div>
    </>
  );
};

export default LogIn;
