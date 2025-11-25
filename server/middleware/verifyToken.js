import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";
import Seller from "../models/seller.model.js";
import DeliveryMan from "../models/delivery.model.js";


export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;


    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.userPhone = user.mobileNumber;
    req.userEmail = user.email; 
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token",
      error: error.message,
    });
  }
};


export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!user.isAdmin) {
      return res.status(403).json({ success: false, message: "Admins only" });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error in admin middleware",
      error: error.message,
    });
  }
};


export const isSeller = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!user.isSeller) {
      return res.status(403).json({ success: false, message: "Sellers only" });
    }


    const seller = await Seller.findOne({ user: user._id });
    if (!seller) {
      return res.status(403).json({ success: false, message: "No seller profile found" });
    }

    req.sellerId = seller._id;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error in seller middleware",
      error: error.message,
    });
  }
};

export const isDeliveryMan = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.isDeliveryMan) {
      return res.status(403).json({ success: false, message: "Delivery men only" });
    }


    const deliveryMan = await DeliveryMan.findOne({ user: user._id });
    if (!deliveryMan) {
      return res.status(403).json({ success: false, message: "No delivery man profile found" });
    }

    req.deliveryManId = deliveryMan._id;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error in delivery man middleware",
      error: error.message,
    });
  }
};