import React, { useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import "./style/dashboard.css";

const Dashboard = () => {
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

  return (
    <div className="dashboard">
      <h1>Welcome to Admin Dashboard</h1>
    </div>
  );
};

export default Dashboard;
