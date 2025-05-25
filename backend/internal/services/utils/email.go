package utils

import (
	"backend/internal/entities"
	"crypto/tls"
	"fmt"
	"github.com/joho/godotenv"
	"gopkg.in/gomail.v2"
	"log"
	"os"
)

func SendEmail(to string, subject string, body string, isHTML bool) error {
	err := godotenv.Load(".env")
	if err != nil {
		return fmt.Errorf("error loading .env file email: %v", err)
	}
	var emailConfig = entities.EmailConfig{
		SMTPHost: os.Getenv("SMTP_HOST"),
		SMTPPort: 465,
		Username: os.Getenv("SMTP_USER"),
		Password: os.Getenv("SMTP_PASSWORD"),
		From:     os.Getenv("EMAILS_FROM_EMAIL"),
	}

	mailer := gomail.NewMessage()
	mailer.SetHeader("From", emailConfig.From)
	mailer.SetHeader("To", to)
	mailer.SetHeader("Subject", subject)

	if isHTML {
		mailer.SetBody("text/html", body)
	} else {
		mailer.SetBody("text/plain", body)
	}

	dialer := gomail.NewDialer(emailConfig.SMTPHost, emailConfig.SMTPPort, emailConfig.Username, emailConfig.Password)
	dialer.TLSConfig = &tls.Config{ServerName: emailConfig.SMTPHost}

	if err := dialer.DialAndSend(mailer); err != nil {
		log.Printf("Failed to send email to %s: %v", to, err)
		return err
	}

	log.Printf("Email successfully sent to %s", to)
	return nil
}

func SendPasswordResetEmail(to string, resetToken string) error {
	resetLink := fmt.Sprintf("http://localhost:5173/reset-password?token=%s", resetToken)

	htmlBody := fmt.Sprintf(`
		<h2>Password Reset Request</h2>
		<p>We received a request to reset your password. Click the link below to set a new password:</p>
		<a href="%s">Reset Password</a>
		<p>If you didn't request a password reset, you can ignore this email.</p>
	`, resetLink)

	subject := "Password Reset Request"
	return SendEmail(to, subject, htmlBody, true)
}
