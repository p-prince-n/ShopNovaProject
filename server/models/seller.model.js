import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
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


    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
      }
    ],


    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],


    isVerifiedSeller: {
      type: Boolean,
      default: false
    },


    contactEmail: {
      type: String,
      required: true
    },
    contactPhone: {
      type: String,
      required: true
    },


    accountInfo: {
      accountHolderName: { type: String, required: true },
      bankName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      upiId: { type: String }
    },
   shippedOrders: [
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    itemId: { type: mongoose.Schema.Types.ObjectId },
    product: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      discount: Number,
      discountPrice: Number,
      images: [String],
    },
    quantity: Number,
    shippedAt: { type: Date, default: Date.now }
  }
],



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
