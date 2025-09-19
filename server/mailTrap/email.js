import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplets.js";

// Configure transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // you can use any SMTP provider
  auth: {
    user: process.env.GMAIL_USER, // your Gmail email
    pass: process.env.GMAIL_APP_PASSWORD // Gmail app password if 2FA enabled
  }
});

// Send verification email
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)
    });
    console.log("Email sent successfully:", info.messageId);
  } catch (e) {
    console.error("Error sending verification email:", e);
    throw new Error("Error while sending email: " + e.message);
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  try {
    const htmlContent = `<p>Welcome ${name} to Authentication Company!</p>`; // Replace with dynamic template if needed
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Welcome!",
      html: htmlContent
    });
    console.log("Welcome email sent:", info.messageId);
  } catch (e) {
    console.error("Error sending welcome email:", e);
    throw new Error("Error while sending email: " + e.message);
  }
};

// Forgot password email
export const generateForgotEmail = async (email, forgotToken) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Forgot Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", `${process.env.CLIENT_URL}/reset-password/${forgotToken}`)
    });
    console.log("Forgot password email sent:", info.messageId);
  } catch (e) {
    console.error("Error sending forgot password email:", e);
    throw new Error("Error while sending email: " + e.message);
  }
};

// Reset password success email
export const sendResetPasswordSuccess = async (email) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Reset Password Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE
    });
    console.log("Reset password success email sent:", info.messageId);
  } catch (e) {
    console.error("Error sending reset password success email:", e);
    throw new Error("Error while sending email: " + e.message);
  }
};
