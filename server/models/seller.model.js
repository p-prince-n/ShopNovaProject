import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // One seller account per user
    },

    shopName: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    logo: {
      type: String,
      default: null
    },

    shopDescription: {
      type: String,
      trim: true
    },

    // Categories seller deals with
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
      }
    ],

    // Products seller lists
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],

    // Seller verification (admin approved or not)
    isVerifiedSeller: {
      type: Boolean,
      default: false
    },

    // Seller contact info
    contactEmail: {
      type: String,
      required: true
    },
    contactPhone: {
      type: String,
      required: true
    },

    // Seller account / payment info
    accountInfo: {
      accountHolderName: { type: String, required: true },
      bankName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      upiId: { type: String } // ✅ UPI attribute
    },
    shippedOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"  // keep track of all orders this seller shipped
      }
    ],

    // Seller stats
    totalSales: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
