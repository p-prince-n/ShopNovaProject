import express from "express";
import {
  createDeliveryMan,
  updateDeliveryMan,
  verifyDeliveryMan,
  getUnverifiedDeliveryMen,
  getVerifiedDeliveryMen,
  getDeliveryManProfile,
  deleteDeliveryManByAdmin,
} from "../Controller/delivery.controller.js";

import { verifyToken, isAdmin, isDeliveryMan } from "../middleware/verifyToken.js";

const deliveryManRouter = express.Router();


deliveryManRouter.post("/create", verifyToken, createDeliveryMan);
deliveryManRouter.put("/update", verifyToken, isDeliveryMan, updateDeliveryMan);
deliveryManRouter.get("/profile", verifyToken, isDeliveryMan, getDeliveryManProfile);


deliveryManRouter.put("/verify/:deliveryManId", verifyToken, isAdmin, verifyDeliveryMan);
deliveryManRouter.get("/unverified", verifyToken, isAdmin, getUnverifiedDeliveryMen);
deliveryManRouter.get("/verified", verifyToken, isAdmin, getVerifiedDeliveryMen);
deliveryManRouter.get("/delete/:id", verifyToken, isAdmin, deleteDeliveryManByAdmin);

export default deliveryManRouter;
