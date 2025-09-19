import express from "express";
import { verifyToken } from "../middleware/verifyToken.js"; 
import {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  removeMultipleFromCart, // ✅ import the new controller
} from "../Controller/cart.controller.js";

const cartRouter = express.Router();

// ✅ Add to cart
cartRouter.post("/add", verifyToken, addToCart);

// ✅ Get user cart
cartRouter.get("/", verifyToken, getCart);

// ✅ Update quantity
cartRouter.put("/update", verifyToken, updateQuantity);

// ✅ Remove single item
cartRouter.delete("/remove", verifyToken, removeFromCart);

// ✅ Remove multiple items
cartRouter.delete("/remove-multiple", verifyToken, removeMultipleFromCart);

// ✅ Clear full cart
cartRouter.delete("/clear", verifyToken, clearCart);

export default cartRouter;
