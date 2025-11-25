import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, ORDER_STATUS_UPDATE_TEMPLATE,
  ORDER_DELIVERY_OTP_TEMPLATE,ITEM_DELIVERY_OTP_TEMPLATE
} from "./emailTemplets.js";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});


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


export const sendWelcomeEmail = async (email, name) => {
  try {
    const htmlContent = `<p>Welcome ${name} to Authentication Company!</p>`;
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



export const sendOrderStatusUpdateEmail = async (email, orderDetails) => {
  try {
    const html = ORDER_STATUS_UPDATE_TEMPLATE
      .replace("{orderId}", orderDetails.orderId)
      .replace("{orderStatus}", orderDetails.orderStatus)
      .replace("{productName}", orderDetails.productName)
      .replace("{quantity}", orderDetails.quantity)
      .replace("{sellerName}", orderDetails.sellerName || "Our Seller")
      .replace("{orderURL}", `${process.env.CLIENT_URL}/orders/${orderDetails.orderId}`);

    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Your Order #${orderDetails.orderId} is now ${orderDetails.orderStatus}`,
      html,
    });
    console.log("Order status update email sent:", info.messageId);
  } catch (e) {
    console.error("Error sending order status update email:", e);
    throw new Error("Error while sending email: " + e.message);
  }
};



export const sendOrderDeliveryOTPEmail = async (email, details) => {
  try {
    const html = ORDER_DELIVERY_OTP_TEMPLATE
      .replace("{userName}", details.userName)
      .replace("{otpCode}", details.otpCode)
      .replace("{orderId}", details.orderId)
      .replace("{totalItems}", details.totalItems)
      .replace("{totalPrice}", details.totalPrice);

    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Order Verification OTP for Order #${details.orderId}`,
      html,
    });
    console.log("Order delivery OTP email sent:", info.messageId);
  } catch (e) {
    console.error("Error sending order delivery OTP email:", e);
    throw new Error("Error while sending email: " + e.message);
  }
};


export const sendItemDeliveryOTPEmail = async (email, details) => {
  try {
    const html = ITEM_DELIVERY_OTP_TEMPLATE
      .replace("{userName}", details.userName)
      .replace("{otpCode}", details.otpCode)
      .replace("{orderId}", details.orderId)
      .replace("{itemName}", details.item.name)
      .replace("{itemQuantity}", details.item.quantity)
      .replace("{itemPrice}", details.item.price);

    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Item Verification OTP for Order #${details.orderId}`,
      html,
    });
    console.log("Item delivery OTP email sent:", info.messageId);
  } catch (e) {
    console.error("Error sending item delivery OTP email:", e);
    throw new Error("Error while sending email: " + e.message);
  }
};