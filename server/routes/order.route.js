// routes/order.routes.js
import express from "express";
import {
  createOrder,
  getUserOrders,
  getUserOrderById,
  cancelUserOrder,
  getSellerOrders,
  sellerAcceptOrder,
  getAllOrders,
  updateOrderStatus,
  getSellerPendingOrders,   
  getSellerShippingPendingOrders,
  sellerShipOrder
} from "../Controller/order.controller.js";

import { verifyToken, isSeller, isAdmin } from "../middleware/verifyToken.js";

const orderRouter = express.Router();

// ----------------------------
// USER ROUTES
// ----------------------------
orderRouter.post("/create", verifyToken, createOrder);                  // Place new order
orderRouter.get("/my-orders", verifyToken, getUserOrders);              // Get all orders of logged-in user
orderRouter.get("/my-orders/:orderId", verifyToken, getUserOrderById);  // Get single order
orderRouter.put("/my-orders/cancel/:orderId", verifyToken, cancelUserOrder); // Cancel order

// ----------------------------
// SELLER ROUTES
// ----------------------------
orderRouter.get("/seller-orders", verifyToken, isSeller, getSellerOrders);         // All seller-related orders
orderRouter.get("/seller-orders/pending", verifyToken, isSeller, getSellerPendingOrders); //  Only pending seller orders
orderRouter.get("/seller-orders/shipping/pending", verifyToken, isSeller, getSellerShippingPendingOrders);
orderRouter.put("/seller-orders/accept/:orderId", verifyToken, isSeller, sellerAcceptOrder); // Seller accepts order
orderRouter.put("/seller-orders/ship/:orderId", verifyToken, isSeller, sellerShipOrder);

// ----------------------------
// ADMIN ROUTES
// ----------------------------
orderRouter.get("/all", verifyToken, isAdmin, getAllOrders);                          // Get all orders
orderRouter.put("/update-status/:orderId", verifyToken, isAdmin, updateOrderStatus);  // Admin updates status

export default orderRouter;
