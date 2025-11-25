
import express from "express";
import {
  createOrder,
  getUserOrders,
  getSellerOrders,
  sellerAcceptOrder,
  getSellerPendingOrders,   
  getSellerShippingPendingOrders,
  sellerShipOrder,
  cancelOrderItems,
  getUnassignedShippedOrders,
  deliveryManAcceptOrder,
  getDeliveryManPendingOrders,
  verifyDeliveryCodeAndMarkDelivered,
  getAdminAnalytics,
  getAllOrderforAdmin,
  exportOrdersToExcel
} from "../Controller/order.controller.js";

import { verifyToken, isSeller, isDeliveryMan, isAdmin } from "../middleware/verifyToken.js";

const orderRouter = express.Router();




orderRouter.post("/create", verifyToken, createOrder);                  
orderRouter.get("/my-orders", verifyToken, getUserOrders);              
orderRouter.post("/cancel", verifyToken, cancelOrderItems);




orderRouter.get("/seller-orders", verifyToken, isSeller, getSellerOrders);         
orderRouter.get("/seller-orders/pending", verifyToken, isSeller, getSellerPendingOrders); 
orderRouter.get("/seller-orders/shipping/pending", verifyToken, isSeller, getSellerShippingPendingOrders);
orderRouter.put("/seller-orders/accept/:orderId", verifyToken, isSeller, sellerAcceptOrder); 
orderRouter.put("/seller-orders/ship/:orderId", verifyToken, isSeller, sellerShipOrder);




 orderRouter.get("/admin/allOrders", verifyToken, isAdmin, getAllOrderforAdmin);  
  orderRouter.get("/admin/downloadOrderItems", verifyToken, isAdmin, exportOrdersToExcel);  


orderRouter.get("/admin/analytics", verifyToken, isAdmin, getAdminAnalytics);




orderRouter.get(
  "/delivery/unassigned-shipped",
  verifyToken,
  isDeliveryMan,
  getUnassignedShippedOrders
);


orderRouter.put(
  "/delivery/accept",
  verifyToken,
  isDeliveryMan,
  deliveryManAcceptOrder
);

orderRouter.put(
  "/delivery/verify",
  verifyToken,
  isDeliveryMan,
  verifyDeliveryCodeAndMarkDelivered
);

orderRouter.get(
  "/delivery/pending",
  verifyToken,
  isDeliveryMan,
  getDeliveryManPendingOrders
);

export default orderRouter;
