import { Link } from "react-router-dom";
import "../../assets/unauthorized.css";
import axios from 'axios'
import React from 'react'

const Unauthorized = () => {
    return (
        <div className="unauthorized-container">
            <h1>🚫 Access Denied!</h1>
            <p>You do not have permission to view this page.</p>
            <Link to="/" className="back-btn">Go to Home</Link>

            {/* 👻 Multiple Horror Ghosts */}
            <div className="ghost ghost1"></div>
            <div className="ghost ghost2"></div>
            <div className="ghost ghost3"></div>
            
        </div>
    );
};

export default Unauthorized;
