import React from "react";
import "../styles.css";

const WelcomePage = ({ email }) => {
    return (
        <div className="login-container">
            <img
                src="/icons8-cat-100.png"
                alt="Cat Icon"
                style={{ width: "150px", height: "150px", marginBottom: "20px" }}
            />
            <h1 className="login-title">Welcome, {email}!</h1>
            <p className="login-subtitle">You have successfully logged in.</p>
        </div>
    );
};

export default WelcomePage;