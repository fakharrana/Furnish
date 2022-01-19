import React, { useState, useLayoutEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Ring } from "react-spinners-css";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import axios from "axios";
import "./style/reviewAnalysis.css";

const ReviewAnalysis = (props) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  //Function for analyzing reviews
  const analyzeReviews = async () => {
    setIsAnalyzing(true);
    try {
      await authAxios.get("/reviewanalysis/analyzereviews").then(
        function (response) {
          if (!response.data.Error) {
            toast.success(response.data.Success, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
            });
          } else {
            toast.error(response.data.Error, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
            });
          }
          setIsAnalyzing(false);
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
      toast.error("Error: Failed to Analyze Reviews", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div className="review-analysis">
      <h3>
        <b>Review Analysis</b>
      </h3>
      <div className="shadow div-review-analysis">
        <div className="background-review-analysis">
          <Link
            id="analyze-reviews-button"
            title="Press to analyze new reviews"
            className="btn btn-info shadow analyze-review-analysis"
            onClick={() => analyzeReviews()}
          >
            Analyze Reviews
          </Link>

          {isAnalyzing ? (
            <>
              <Ring
                className="spinner-reviewanalysis"
                color="#009688"
                size={50}
              />
              <div className="analyzing">
                <b>Analyzing....</b>
              </div>
              <Button
                title="Press to view positive reviews"
                className="btn btn-success shadow positive-review-analysis"
                to="/reviewanalysis/positivereviews"
                disabled={true}
              >
                Positive Reviews
              </Button>
              <Button
                title="Press to view negative reviews"
                className="btn btn-danger shadow negative-review-analysis"
                to="/reviewanalysis/negativereviews"
                disabled={true}
              >
                Negative Reviews
              </Button>
            </>
          ) : (
            <>
              <Link
                id="positive-reviews-button"
                title="Press to view positive reviews"
                className="btn btn-success shadow positive-review-analysis"
                to="/reviewanalysis/positivereviews"
              >
                Positive Reviews
              </Link>
              <Link
                id="negative-reviews-button"
                title="Press to view negative reviews"
                className="btn btn-danger shadow negative-review-analysis"
                to="/reviewanalysis/negativereviews"
              >
                Negative Reviews
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewAnalysis;
