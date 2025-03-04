namespace OTP_backend.Services;

public interface IOTPService
{
    string GenerateOTP(string email);
    bool ValidateOTP(string email, string otp);
}