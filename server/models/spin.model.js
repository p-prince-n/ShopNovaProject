import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import User from "./auth.model.js";

const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);

const spinSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true },
    code: { type: String, unique: true, default: () => nanoid() },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    used:{ type: Boolean, default: false },


    expire: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);


export default mongoose.models.Spin || mongoose.model("Spin", spinSchema);
