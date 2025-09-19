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
        // match: [/^\+[1-9]\d{9,14}$/, "Please enter a valid phone number with country code"]
    },

    isMobileVerified: {
        type: Boolean,
        default: false
    },

    mobileVerificationCode: String,
    mobileVerificationCodeExpiredAt: Date,

//     address: [
//     {
//       address: { type: String, trim: true, required: true }, // full address in one string
//       addressType: {
//         type: String,
//         enum: ["Home", "Work", "Other"],
//         default: "Home",
//       },
//       isDefault: { type: Boolean, default: false },
//     },
//   ],

 address: [{
        roomNo: { type: String, trim: true },
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pinCode: { type: String, trim: true },
        country: { type: String, trim: true },
        landmark: { type: String, trim: true },   // optional
        addressType: {                            // e.g., Home / Office
            type: String,
            enum: ["Home", "Work", "Other"],
            default: "Home",
        },
        isDefault: { type: Boolean, default: false } // useful for users with multiple addresses
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
    // ✅ Reference to Seller profile (default null)
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
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
