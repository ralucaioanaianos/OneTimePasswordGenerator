using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using OTP_backend.Services;
using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddMemoryCache(); 
builder.Services.AddSingleton<IEmailService>(new SmtpEmailService(
    builder.Configuration["SmtpSettings:Username"],
    builder.Configuration["SmtpSettings:Password"]
));
builder.Services.AddSingleton<IOTPService, OTPService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "OTP API", Version = "v1" });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "OTP API V1");
    });
}

app.UseCors("AllowReactFrontend");

app.UseHttpsRedirection();

app.MapMethods("/api/login", new[] { "OPTIONS" }, () => Results.Ok())
   .RequireCors("AllowReactFrontend");

app.MapMethods("/api/validate-otp", new[] { "OPTIONS" }, () => Results.Ok())
   .RequireCors("AllowReactFrontend");

app.MapPost("/api/login", async ([FromBody] string email, IEmailService emailService, IOTPService otpService) =>
{
    var otp = otpService.GenerateOTP(email);
    await emailService.SendEmailAsync(email, "Your OTP", $"Your OTP is: {otp}");
    return Results.Ok(new { Message = "OTP sent to your email." });
}).RequireCors("AllowReactFrontend");

app.MapPost("/api/get-otp-toast", ([FromBody] string email, IOTPService otpService) =>
{
    var otp = otpService.GenerateOTP(email);
    return Results.Ok(new { OTP = otp, Message = "OTP generated successfully." });
}).RequireCors("AllowReactFrontend");

string HashOtp(string otp)
{
    var trimmedOtp = otp.Trim();
    using (var sha256 = SHA256.Create())
    {
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(trimmedOtp));
        return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower(); 
    }
}

app.MapPost("/api/validate-otp", ([FromBody] OTPValidationRequest request, IOTPService otpService) =>
{
    var hashedOtp = HashOtp(request.OTP);
    Console.WriteLine("Server Hashed OTP: " + hashedOtp);
    Console.WriteLine("Original: " + request.OTP);
    
    var isValid = otpService.ValidateOTP(request.Email, hashedOtp);
    if (isValid)
    {
        return Results.Ok(new { Message = $"Hello, {request.Email}" });
    }
    return Results.BadRequest(new { Message = "Invalid OTP." });
}).RequireCors("AllowReactFrontend");

app.Run();

public record OTPValidationRequest(string Email, string OTP);