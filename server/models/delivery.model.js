import mongoose from "mongoose";

const deliveryManSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    vehicleNumber: {
      type: String,
      trim: true,
      required: [true, "Vehicle number is required"],
      match: [
        /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/, 
        "Please enter a valid vehicle number (e.g., MH12AB1234)"
      ],
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

    drivingLicense: {
      type: String,
      trim: true,
      required: [true, "Driving license number is required"],
      match: [
        /^[A-Z]{2}\d{13}$/,
        "Please enter a valid driving license number (e.g., DL1420110149213)"
      ],
    },

    status: {
      type: String,
      enum: ["Available", "On Delivery", "Inactive"],
      default: "Available",
    },


    isVerifiedDelivery: {
      type: Boolean,
      default: false
    },


    assignedOrders: [
      {
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
           ref: "Product",
        },
        assignedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const DeliveryMan =
  mongoose.models.DeliveryMan ||
  mongoose.model("DeliveryMan", deliveryManSchema);

export default DeliveryMan;
