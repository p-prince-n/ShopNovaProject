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
      default: null,
    },
    deliveryMan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryMan",
      default: null,
    },
    deliveryVerificationCode: String,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    size: { type: String },


    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Processing",
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


orderSchema.pre("save", function (next) {
  this.totalItems = this.items.reduce(
    (sum, item) => (item.orderStatus !== "Cancelled" ? sum + item.quantity : sum),
    0
  );
  this.totalPrice = this.items.reduce(
    (sum, item) =>
      item.orderStatus !== "Cancelled" ? sum + item.discountPrice * item.quantity : sum,
    0
  );
  next();
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
