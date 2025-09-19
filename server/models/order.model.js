import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      default:null,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true, // snapshot of product price
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountPrice: {
      type: Number,
      required: true, // price - discount
    },
    size: { type: String },

    // 👇 status per item only
    orderStatus: {
      type: String,
      enum: [
        "Pending",    // placed but not confirmed
        "Processing", // seller confirmed, preparing
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    shippingAddress: {
      roomNo: { type: String, trim: true },
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pinCode: { type: String, trim: true },
      country: { type: String, trim: true },
      landmark: { type: String, trim: true },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "Card", "NetBanking", "Wallet"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    transactionId: { type: String, default: null },

    totalItems: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },

    trackingInfo: {
      courier: { type: String, default: null },
      trackingId: { type: String, default: null },
      estimatedDelivery: { type: Date },
    },
  },
  { timestamps: true }
);

// auto-calc totals before save
orderSchema.pre("save", function (next) {
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  );
  next();
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
