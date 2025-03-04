namespace OTP_backend.Services;

using Microsoft.Extensions.Caching.Memory;
using System.Security.Cryptography;
using System.Text;

public class OTPService : IOTPService
{
    private readonly IMemoryCache _cache;

    public OTPService(IMemoryCache cache)
    {
        _cache = cache;
    }

    public string GenerateOTP(string email)
    {
        var otp = new Random().Next(100000, 999999).ToString(); 
        var hashedOtp = HashOtp(otp); 
        _cache.Set(email, hashedOtp, TimeSpan.FromMinutes(5)); 
        return otp; 
    }

    public bool ValidateOTP(string email, string hashedOtp)
    {
        if (_cache.TryGetValue(email, out string storedHashedOtp))
        {
            return storedHashedOtp == hashedOtp; 
        }
        return false;
    }

    public string HashOtp(string otp)
    {
        var trimmedOtp = otp.Trim(); 
        using (var sha256 = SHA256.Create())
        {
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(trimmedOtp));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower(); 
        }
    }
}