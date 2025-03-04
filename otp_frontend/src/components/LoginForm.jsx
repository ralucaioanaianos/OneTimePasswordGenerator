import React, { useState, useEffect } from "react";
import { sendEmailForOTP, getOtpAsToast, validateOTP } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles.css";
import WelcomePage from "./WelcomePage";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEmailButtonDisabled, setIsEmailButtonDisabled] = useState(false);
    const [isToastButtonDisabled, setIsToastButtonDisabled] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setIsTyping(true);
        setError(validateEmail(value) ? "" : "Please enter a valid email address.");
    };

    const startCountdown = () => {
        setCountdown(300);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleGetOtpViaEmail = async () => {
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            const response = await sendEmailForOTP(email);
            if (response.message === "OTP sent to your email.") {
                setShowOtpInput(true);
                setError("");
                setIsToastButtonDisabled(true);
                startCountdown();
                setTimeout(() => {
                    setIsToastButtonDisabled(false);
                }, 5 * 60 * 1000);
            }
        } catch (err) {
            setError("Failed to send OTP. Please try again.");
        }
    };

    const handleGetOtpAsToast = async () => {
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            const response = await getOtpAsToast(email);
            console.log("Backend Response:", response);

            if (response.message === "OTP generated successfully.") {
                setShowOtpInput(true);
                setError("");
                setIsEmailButtonDisabled(true);

                toast.success(`Your OTP is: ${response.otp}`, {
                    autoClose: 1000 * 60 * 5,
                });

                setTimeout(() => {
                    setIsEmailButtonDisabled(false);
                }, 5 * 60 * 1000);
            } else {
                setError("Failed to generate OTP. Please try again.");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to generate OTP. Please try again.");
        }
    };

    const handleLogin = async () => {
        const trimmedOtp = otp.trim();
        console.log("Client Raw OTP:", trimmedOtp);

        try {
            const response = await validateOTP(email, trimmedOtp);
            if (response.message.startsWith("Hello,")) {
                setIsLoggedIn(true);
            } else {
                setError("Invalid OTP. Please try again.");
            }
        } catch (err) {
            setError("Failed to validate OTP. Please try again.");
        }
    };

    if (isLoggedIn) {
        return <WelcomePage email={email} />;
    }

    return (
        <div className="login-container">
            <img
                src="/icons8-key-120.png"
                alt="Cat Icon"
                style={{ width: "100px", height: "100px", marginBottom: "20px" }}
            />
            <h1 className="login-title">Welcome to the most secure bank!</h1>
            <p className="login-subtitle">Please login to your account</p>
            <div>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                />
            </div>

            {countdown > 0 && (
                <p className="countdown">Time remaining: {formatTime(countdown)}</p>
            )}

            <button
                onClick={handleGetOtpViaEmail}
                disabled={!validateEmail(email) || isEmailButtonDisabled || countdown > 0}
                style={{
                    backgroundColor: !validateEmail(email) || isEmailButtonDisabled || countdown > 0 ? "#c8d8e4" : "#2b6777",
                    cursor: !validateEmail(email) || isEmailButtonDisabled || countdown > 0 ? "not-allowed" : "pointer",
                }}
            >
                Get OTP via Email
            </button>
            <button
                onClick={handleGetOtpAsToast}
                disabled={!validateEmail(email) || isToastButtonDisabled || countdown > 0}
                style={{
                    backgroundColor: !validateEmail(email) || isToastButtonDisabled || countdown > 0 ? "#c8d8e4" : "#2b6777",
                    cursor: !validateEmail(email) || isToastButtonDisabled || countdown > 0 ? "not-allowed" : "pointer",
                }}
            >
                Get OTP as Toast
            </button>

            {showOtpInput && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                </div>
            )}

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default LoginForm;