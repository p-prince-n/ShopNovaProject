import express from "express";
import { verifyToken } from "../middleware/verifyToken.js"; 
import {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  removeMultipleFromCart,
} from "../Controller/cart.controller.js";

const cartRouter = express.Router();


cartRouter.post("/add", verifyToken, addToCart);


cartRouter.get("/", verifyToken, getCart);


cartRouter.put("/update", verifyToken, updateQuantity);


cartRouter.delete("/remove", verifyToken, removeFromCart);


cartRouter.delete("/remove-multiple", verifyToken, removeMultipleFromCart);


cartRouter.delete("/clear", verifyToken, clearCart);

export default cartRouter;
