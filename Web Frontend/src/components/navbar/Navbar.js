import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { FiLogOut } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import "./Navbar.css";

const Navbar = (props) => {
  const [refresh, setRefresh] = useState(0);
  const [getLogInStatus, setLogInStatus] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const history = useHistory();

  //Hook for loading and re-loading data
  useEffect(() => {
    const getstatus = localStorage.getItem(process.env.REACT_APP_ACCESS_TOKEN);
    setLogInStatus(getstatus);
  }, [refresh, props.refresh]);

  //Function for logout
  const logOut = async () => {
    setShowDropdown(false);
    localStorage.removeItem(process.env.REACT_APP_ACCESS_TOKEN);
    setRefresh(Math.floor(Math.random() * 1000));
    history.push("/login");
  };

  return (
    <>
      {getLogInStatus !== null ? (
        <>
          <div className="header">
            <Link to="/" className="title-link">
              <p className="title">ADMIN DASHBOARD</p>
            </Link>
            <Dropdown
              className="dropdown"
              onMouseLeave={() => setShowDropdown(false)}
              onMouseOver={() => setShowDropdown(true)}
            >
              <Dropdown.Toggle
                variant=""
                onMouseOver={() => setShowDropdown(!showDropdown)}
                className="admin-dropdown"
                id="admin-dropdown"
              >
                Admin
              </Dropdown.Toggle>

              <Dropdown.Menu show={showDropdown}>
                <Dropdown.Item className="changepassword-dropdown">
                  <Link
                    id="changepassword-button"
                    className="changepassword-decoration"
                    to="/changepassword"
                  >
                    <FaEdit size={20} /> <span>Change Password</span>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item
                  id="logout-button"
                  className="logout-dropdown"
                  onClick={logOut}
                >
                  <FiLogOut size={22} /> <span>Log Out</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <nav className="nav-menu">
            <ul className="nav-menu-items">
              {SidebarData.map((item, index) => {
                return (
                  <li key={index} className={item.className}>
                    <Link id={item.id} to={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Navbar;
