import React from "react";
import "../../assets/notfound.css"
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="notfound-container">
      <div className="notfound-wrapper">
        <div className="notfound-content">
          <div className="notfound-image">
            <h1 className="notfound-title">404</h1>
          </div>

          <div className="notfound-text">
            <h3 className="notfound-heading">Looks like you're lost</h3>
            <p className="notfound-description">
              The page you are looking for is not available!
            </p>
            <button
              className="notfound-btn"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
