
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getPurchaseBasedRecommendations } from "../Controller/recommendation.controller.js";

const recommendationsRouter = express.Router();

recommendationsRouter.get("/purchase-based", verifyToken, getPurchaseBasedRecommendations);

export default recommendationsRouter;
