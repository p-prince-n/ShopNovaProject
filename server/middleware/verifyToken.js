import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";
import Seller from "../models/seller.model.js";

// ✅ Verify Token and attach userId & mobileNumber
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // token stored in cookies
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    // ✅ Fetch user to get mobileNumber
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.userPhone = user.mobileNumber; // attach user's phone number to req
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token",
      error: error.message,
    });
  }
};

// ✅ Admin Only
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

// ✅ Seller Only
export const isSeller = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!user.isSeller) {
      return res.status(403).json({ success: false, message: "Sellers only" });
    }

    // check if seller profile exists
    const seller = await Seller.findOne({ user: user._id });
    if (!seller) {
      return res.status(403).json({ success: false, message: "No seller profile found" });
    }

    req.sellerId = seller._id; // attach sellerId for controllers
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error in seller middleware",
      error: error.message,
    });
  }
};
