namespace OTP_backend.Services;

using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

public class SmtpEmailService : IEmailService
{
    private readonly string _smtpServer;
    private readonly int _smtpPort;
    private readonly string _smtpUsername;
    private readonly string _smtpPassword;

    public SmtpEmailService(string smtpUsername, string smtpPassword, string smtpServer = "smtp.mail.yahoo.com", int smtpPort = 587)
    {
        _smtpUsername = smtpUsername;
        _smtpPassword = smtpPassword;
        _smtpServer = smtpServer;
        _smtpPort = smtpPort;
    }

    public async Task SendEmailAsync(string email, string subject, string message)
    {
        using (var client = new SmtpClient(_smtpServer, _smtpPort))
        {
            client.Credentials = new NetworkCredential(_smtpUsername, _smtpPassword);
            client.EnableSsl = true;

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_smtpUsername),
                Subject = subject,
                Body = message,
                IsBodyHtml = false
            };
            mailMessage.To.Add(email);

            await client.SendMailAsync(mailMessage);
        }
    }
}