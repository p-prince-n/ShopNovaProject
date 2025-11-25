import express from "express";
import {
  createSpin,
  getUserSpins,
  deleteSpin,
  getNextSpinTime,
  verifySpinCode,
} from "../Controller/spin.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const spinRouter = express.Router();


spinRouter.post("/", verifyToken, createSpin);
spinRouter.get("/", verifyToken, getUserSpins);
spinRouter.delete("/:id", verifyToken, deleteSpin);
spinRouter.get("/next", verifyToken, getNextSpinTime);
spinRouter.post("/verify", verifyToken, verifySpinCode);

export default spinRouter;
