import express from "express";
import {
  createSeller,
  updateSeller,
  verifySeller,
  getUnverifiedSellers,
  getSellerProfile,
  getVerifiedSellers,
  exportSellersToExcel,
  deleteSellerByAdmin
} from "../Controller/seller.controller.js";

import {
  getSellerOrders,
  sellerAcceptOrder,
} from "../Controller/order.controller.js";

import { verifyToken, isAdmin, isSeller } from "../middleware/verifyToken.js";

const sellerRouter = express.Router();


sellerRouter.post("/create", verifyToken, createSeller);
sellerRouter.put("/update", verifyToken, isSeller, updateSeller);
sellerRouter.get("/profile", verifyToken, isSeller, getSellerProfile);


sellerRouter.get("/orders", verifyToken, isSeller, getSellerOrders);
sellerRouter.put("/orders/accept/:orderId", verifyToken, isSeller, sellerAcceptOrder);


sellerRouter.put("/verify/:sellerId", verifyToken, isAdmin, verifySeller);
sellerRouter.get("/unverified", verifyToken, isAdmin, getUnverifiedSellers);
sellerRouter.get("/verified", verifyToken, isAdmin, getVerifiedSellers);
sellerRouter.get("/downloadSellerData", verifyToken, isAdmin, exportSellersToExcel);
sellerRouter.get("/delete/:id", verifyToken, isAdmin, deleteSellerByAdmin);

export default sellerRouter;
