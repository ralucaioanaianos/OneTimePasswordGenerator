# OneTimePasswordGenerator

Welcome to the One-Time Password (OTP) Generator and Validator project! This application is designed to securely generate and validate OTPs (One-Time Passwords) for user authentication into a banking application.

## 1. Functionalities:
### - OTP Generation:
Generates a 6-digit OTP for a given email address.
Hashes the OTP using SHA-256 for secure storage and transmission.

### - OTP Validation:
Validates the OTP provided by the user against the hashed OTP stored in the system.
Ensures the OTP is valid and has not expired (OTPs expire after 5 minutes).

### - Email Integration:
Sends the generated OTP to the user’s email address for secure delivery.

### - Secure Hashing:
Uses SHA-256 encryption to hash OTPs, ensuring they cannot be easily reverse-engineered.

### - Caching:
Stores hashed OTPs in memory (using IMemoryCache) for quick validation and automatic expiration.

## 2. Technologies Used:
This project is built using the following technologies:
- .NET 8.0: The backend is developed using the latest .NET framework, ensuring high performance and scalability.
- ASP.NET Core: Used to build the RESTful API for OTP generation and validation.
- SHA-256 Encryption: Provides secure hashing for OTPs, ensuring they are stored and transmitted safely.
- Memory Caching: Uses IMemoryCache to store OTPs temporarily, with automatic expiration after 5 minutes.
- SMTP Email Service: Integrates with SMTP to send OTPs to users via email.

## 3. Encryption and Security
Security is a top priority in this project. Here’s how I ensured that data is protected:
### - SHA-256 Hashing:
OTPs are hashed using the SHA-256 algorithm before being stored or transmitted.
This ensures that even if the hashed OTP is intercepted, it cannot be easily decrypted.

### - Secure Storage:
Hashed OTPs are stored in memory using IMemoryCache, which automatically clears expired OTPs after 5 minutes.
No sensitive data (e.g., raw OTPs) is stored permanently.

### - Email Delivery:
OTPs are sent to users via email using SMTP, ensuring secure delivery.
The email content is minimal and only includes the OTP, reducing the risk of exposure.

### - Validation:
OTPs are validated by comparing the hashed version of the user-provided OTP with the stored hashed OTP.
This ensures that only the correct OTP can be validated.

## 4. How It Works
### - Generate OTP:
The user provides their email address.
The system generates a 6-digit OTP, hashes it, and stores the hashed OTP in memory.
The raw OTP is sent to the user’s email or appears as a toast message.

### - Validate OTP:
The user enters the OTP they received.
The system hashes the provided OTP and compares it with the stored hashed OTP.
If the hashes match and the OTP has not expired, the validation is successful.

