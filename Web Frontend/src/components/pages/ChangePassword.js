import React, { useState, useLayoutEffect } from "react";
import { Col, Form, Button } from "react-bootstrap";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./style/changePassword.css";

const ChangePassword = (props) => {
  const [getShowOldPasword, setShowOldPassword] = useState(false);
  const [getShowNewPasword, setShowNewPassword] = useState(false);
  const [getOldPassword, setOldPassword] = useState("");
  const [getNewPassword, setNewPassword] = useState("");

  const history = useHistory();

  //Hook for loading and re-loading data
  useLayoutEffect(() => {
    const getAccessToken = localStorage.getItem(
      process.env.REACT_APP_ACCESS_TOKEN
    );
    if (getAccessToken === null) {
      history.push("/login");
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

  //Function to show/hide admin's old password
  const showOldPassword = () => {
    setShowOldPassword(!getShowOldPasword);
  };

  //Function to show/hide admin's new password
  const showNewPassword = () => {
    setShowNewPassword(!getShowNewPasword);
  };

  //Function for validation on form submission
  const validate = () => {
    if (!getOldPassword && !getNewPassword) {
      toast.error("Kindly fill the required details", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return false;
    }

    if (!getOldPassword) {
      toast.error("Old password cannot be empty", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return false;
    }

    if (!getNewPassword) {
      toast.error("New password cannot be empty", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return false;
    }

    if (getNewPassword.length < 8) {
      toast.error("New password cannot be less than 8 characters", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      return false;
    }

    return true;
  };

  //Function changing password
  const changePassword = async (e) => {
    e.preventDefault();
    const userData = {
      oldPassword: getOldPassword,
      newPassword: getNewPassword,
    };

    if (validate()) {
      try {
        await authAxios.put("/users/changepassword", userData).then(
          function (response) {
            console.log(response.data);
            if (response.data.Success) {
              toast.success(response.data.Success, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
              });
              history.push("/");
            }
            if (response.data.name) {
              toast.error("Incorrect Old Password", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
              });
            }
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
        toast.error("Error: Incorrect Old Password", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
        });
      }
    }
  };

  return (
    <div className="changepassword shadow">
      <h3 className="form-header-changepassword">
        <b>Change Password</b>
      </h3>
      <Form className="form-changepassword">
        <Form.Row>
          <Form.Group as={Col} controlId="oldpassword-id">
            <Form.Label className="label">Old Password</Form.Label>
            <Form.Control
              className="shadow w-75"
              type={getShowOldPasword ? "text" : "password"}
              placeholder="Enter your old  password"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <div
              onClick={() => showOldPassword()}
              className="showpassword-changepassword"
            >
              {getShowOldPasword ? (
                <AiFillEyeInvisible size="26px" color="#009688" />
              ) : (
                <AiFillEye size="26px" color="#009688" />
              )}
            </div>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="newpassword-id">
            <Form.Label className="label">New Password</Form.Label>
            <Form.Control
              className="shadow w-75"
              type={getShowNewPasword ? "text" : "password"}
              placeholder="Enter your new password "
              onChange={(e) => setNewPassword(e.target.value)}
            />{" "}
            <div
              onClick={() => showNewPassword()}
              className="showpassword-changepassword"
            >
              {getShowNewPasword ? (
                <AiFillEyeInvisible size="26px" color="#009688" />
              ) : (
                <AiFillEye size="26px" color="#009688" />
              )}
            </div>
          </Form.Group>
        </Form.Row>
        <Button
          onClick={(e) => changePassword(e)}
          className="btn btn-success button-changepassword shadow"
          type="submit"
        >
          Save
        </Button>
      </Form>
    </div>
  );
};

export default ChangePassword;
