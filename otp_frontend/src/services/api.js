const API_BASE_URL = "http://localhost:5095";

export const sendEmailForOTP = async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
    });
    return response.json();
};

export const getOtpAsToast = async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/get-otp-toast`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
    });
    const data = await response.json();
    console.log("API Response:", data);
    return data;
};

export const validateOTP = async (email, otp) => {
    const response = await fetch(`${API_BASE_URL}/api/validate-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: email, OTP: otp }),
    });
    return response.json();
};