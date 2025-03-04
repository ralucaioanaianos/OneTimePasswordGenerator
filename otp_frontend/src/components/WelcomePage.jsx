import React from "react";
import "../styles.css";

const WelcomePage = ({ email }) => {
    return (
        <div className="login-container">
            <h1 className="login-title">Welcome, {email}!</h1>
            <p className="login-subtitle">You have successfully logged in.</p>
        </div>
    );
};

export default WelcomePage;