import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: "Other"
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,

    },

    isMobileVerified: {
        type: Boolean,
        default: false
    },

    mobileVerificationCode: String,
    mobileVerificationCodeExpiredAt: Date,

 address: [{
        roomNo: { type: String, trim: true },
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pinCode: { type: String, trim: true },
        country: { type: String, trim: true },
        landmark: { type: String, trim: true },
        addressType: {
            type: String,
            enum: ["Home", "Work", "Other"],
            default: "Home",
        },
        isDefault: { type: Boolean, default: false }
    }],


    lastLogin: {
        type: Date,
        default: Date.now
    },

    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    isDeliveryMan: {
        type: Boolean,
        default: false
    },
    isDeliveryManVerification: {
        type: Boolean,
        default: false
    },
    isSellerVerification: {
        type: Boolean,
        default: false,
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        default: null,
    },
     delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryMan",
        default: null,
    },

    resetPasswordToken: String,
    resetPasswordTokenExpiredAt: Date,
    verificationToken: String,
    verificationTokenExpiredAt: Date,
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]

}, { timestamps: true });
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
