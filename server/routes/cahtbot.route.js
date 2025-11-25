
import express from "express";
import { productAssistant } from "../Controller/chatbot.controller.js";

const chatBotRouter = express.Router();

chatBotRouter.post("/query", productAssistant);

export default chatBotRouter;
