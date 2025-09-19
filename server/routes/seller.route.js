import express from "express";
import {
  createSeller,
  updateSeller,
  verifySeller,
  getUnverifiedSellers,
  getSellerProfile,
  getVerifiedSellers,
} from "../Controller/seller.controller.js";

import {
  getSellerOrders,
  sellerAcceptOrder, // ✅ import new controller
} from "../Controller/order.controller.js";

import { verifyToken, isAdmin, isSeller } from "../middleware/verifyToken.js";

const sellerRouter = express.Router();

// ✅ Seller routes (for logged-in users)
sellerRouter.post("/create", verifyToken, createSeller);
sellerRouter.put("/update", verifyToken, isSeller, updateSeller);
sellerRouter.get("/profile", verifyToken, isSeller, getSellerProfile);

// Orders
sellerRouter.get("/orders", verifyToken, isSeller, getSellerOrders); // all relevant orders
sellerRouter.put("/orders/accept/:orderId", verifyToken, isSeller, sellerAcceptOrder); // ✅ accept order

// ✅ Admin routes
sellerRouter.put("/verify/:sellerId", verifyToken, isAdmin, verifySeller);
sellerRouter.get("/unverified", verifyToken, isAdmin, getUnverifiedSellers);
sellerRouter.get("/verified", verifyToken, isAdmin, getVerifiedSellers);

export default sellerRouter;
