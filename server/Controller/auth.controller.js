import User from "../models/auth.model.js";
import Seller from "../models/seller.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    generateForgotEmail,
    sendResetPasswordSuccess
} from "../mailTrap/email.js";
import { sendMobileVerificationCode } from "../utils/sms.js";
import mongoose from "mongoose";

// ---------------- SIGN UP ----------------
export const signUp = async (req, res) => {
    const { email, password, name, mobileNumber } = req.body;
    try {
        if (!email || !password || !name || !mobileNumber) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or mobile number already exists', success: false });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password should contain at least 6 characters', success: false });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        // Generate mobile OTP first
        const mobileVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            name,
            password: hashPassword,
            mobileNumber,
            mobileVerificationCode,
            mobileVerificationCodeExpiredAt: Date.now() + 10 * 60 * 1000, // 10 min
            isMobileVerified: false,
            isVerified: false // email
        });
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationToken = verificationToken;
        user.verificationTokenExpiredAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();
        
        await sendVerificationEmail(user.email, verificationToken);

        generateTokenAndSetCookie(res, user._id);
        await sendMobileVerificationCode(user.mobileNumber, `Your mobile number verification code is : ${mobileVerificationCode}`);

        res.status(201).json({
            success: true,
            message: 'User created successfully. Please verify your mobile number first.',
            user: { ...user._doc, password: undefined }
        });
    } catch (e) {
        res.status(500).json({ message: e.message, success: false });
    }
};

// ---------------- VERIFY MOBILE ----------------
export const verifyMobile = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            mobileVerificationCode: code,
            mobileVerificationCodeExpiredAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired mobile verification code', success: false });
        }

        // Mark mobile as verified
        user.mobileVerificationCode = undefined;
        user.isMobileVerified = true;
        user.mobileVerificationCodeExpiredAt = undefined;

        // Now generate email verification token
        // 24 hrs

        await user.save();

        // Send email verification now

        res.status(200).json({
            success: true,
            message: 'Mobile number verified successfully. Email verification code sent.',
            user: { ...user._doc, password: undefined }
        });
    } catch (e) {
        res.status(500).json({ message: e.message, success: false });
    }
};

// ---------------- VERIFY EMAIL ----------------
export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiredAt: { $gt: Date.now() },
            isMobileVerified: true // must have verified mobile first
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid/expired email verification code or mobile not verified', success: false });
        }

        user.verificationToken = undefined;
        user.isVerified = true;
        user.verificationTokenExpiredAt = undefined;

        await user.save();
        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully.',
            user: { ...user._doc, password: undefined }
        });
    } catch (e) {
        res.status(500).json({ message: e.message, success: false });
    }
};

// ---------------- SIGN IN ----------------
export const signIn = async (req, res) => {
    const { identifier, password } = req.body;
    // "identifier" can be email or mobileNumber

    try {
        if (!identifier || !password) {
            return res.status(400).json({ message: 'Email/Mobile and password are required', success: false });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password should contain at least 6 characters', success: false });
        }

        const user = await User.findOne({
            $or: [{ email: identifier }, { mobileNumber: identifier }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User with this email or mobile number doesn\'t exist', success: false });
        }

        // Block login if not verified
        if (!user.isMobileVerified) {
            return res.status(403).json({ message: 'Please verify your mobile number first', success: false });
        }
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email first', success: false });
        }

        const verifyPass = await bcrypt.compare(password, user.password);
        if (!verifyPass) {
            return res.status(400).json({ message: 'Invalid Password', success: false });
        }

        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = Date.now();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Login successfully',
            user: { ...user._doc, password: undefined }
        });
    } catch (e) {
        res.status(500).json({ message: e.message, success: false });
    }
};

// ---------------- SIGN OUT ----------------
export const signOut = (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: 'Log out successfully' });
};

// ---------------- FORGOT PASSWORD ----------------
export const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required', success: false });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User with this email doesn\'t exist', success: false });
        }

        const forgotToken = crypto.randomBytes(20).toString('hex');
        const forgotTokenExpiredAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hr

        await generateForgotEmail(user.email, forgotToken);
        user.resetPasswordToken = forgotToken;
        user.resetPasswordTokenExpiredAt = forgotTokenExpiredAt;
        await user.save();

        res.status(200).json({ success: true, message: 'Link is sent to your email' });
    } catch (e) {
        res.status(500).json({ message: e.message, success: false });
    }
};

// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordTokenExpiredAt: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token', success: false });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiredAt = undefined;

        await user.save();
        await sendResetPasswordSuccess(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (e) {
        res.status(500).json({ message: e.message, success: false });
    }
};

// ---------------- CHECK AUTH ----------------
export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        res.status(200).json({ success: true, user });
    } catch (e) {
        res.status(500).json({ message: e.message, success: false });
    }
};

// ---------------- UPDATE USER ----------------
export const updateUser = async (req, res) => {
    const userId = req.userId; // from auth middleware
    const { email, name, mobileNumber, address, gender, isSeller, isSellerVerification } = req.body; // added gender

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        let emailChanged = false;
        let mobileChanged = false;

        // If email updated
        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: "Email already in use", success: false });
            }

            user.email = email;
            user.isVerified = false;

            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
            user.verificationToken = verificationToken;
            user.verificationTokenExpiredAt = Date.now() + 24 * 60 * 60 * 1000;

            await sendVerificationEmail(user.email, verificationToken);
            emailChanged = true;
        }

        // If mobile updated
        if (mobileNumber && mobileNumber !== user.mobileNumber) {
            const existingMobile = await User.findOne({ mobileNumber });
            if (existingMobile) {
                return res.status(400).json({ message: "Mobile number already in use", success: false });
            }

            user.mobileNumber = mobileNumber;
            user.isMobileVerified = false;

            const mobileVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            user.mobileVerificationCode = mobileVerificationCode;
            user.mobileVerificationCodeExpiredAt = Date.now() + 10 * 60 * 1000;

            mobileChanged = true;
        }

        await user.save();

        if (mobileChanged) {
            await sendMobileVerificationCode(
                user.mobileNumber,
                `Your verification code is: ${user.mobileVerificationCode}`
            );
        }

        // Normal fields
        if (name) user.name = name;
        if (gender) user.gender = gender; // updated gender
        if (address) {
            user.address = { ...user.address, ...address };
        }
        if(isSeller) user.isSeller=true;
        if(isSellerVerification) user.isSellerVerification=isSellerVerification;

        await user.save();

        let message = "Profile updated successfully.";
        if (mobileChanged) message += " Please verify your new mobile number.";
        if (emailChanged) message += " Please verify your new email.";

        res.status(200).json({
            success: true,
            message,
            user: { ...user._doc, password: undefined }
        });

    } catch (e) {
        res.status(500).json({ message: e.message, success: false });
    }
};



export const resendMobileVerification = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.isMobileVerified) {
            return res.status(400).json({ success: false, message: "Mobile already verified" });
        }

        const mobileVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.mobileVerificationCode = mobileVerificationCode;
        user.mobileVerificationCodeExpiredAt = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendMobileVerificationCode(
            user.mobileNumber,
            `Your mobile verification code is: ${mobileVerificationCode}`
        );

        res.status(200).json({ success: true, message: "New OTP sent to mobile" });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};


export const resendEmailVerification = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "Email already verified" });
        }

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationToken = verificationToken;
        user.verificationTokenExpiredAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        await sendVerificationEmail(user.email, verificationToken);

        res.status(200).json({ success: true, message: "New verification code sent to email" });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};


// Toggle product in wishlist
export const toggleWishlist = async (req, res) => {
    try {
        const userId = req.userId; // use userId from verifyToken middleware
        const { productId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if product is already in wishlist
        const index = user.wishlist.findIndex(id => id.toString() === productId);

        if (index === -1) {
            // Not in wishlist, add it
            user.wishlist.push(productId);
            await user.save();
            return res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist });
        } else {
            // Already in wishlist, remove it
            user.wishlist.splice(index, 1);
            await user.save();
            return res.status(200).json({ message: "Product removed from wishlist", wishlist: user.wishlist });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getWishlist = async (req, res) => {
  try {
    const userId = req.userId; // from verifyToken middleware

    const user = await User.findById(userId).populate({
      path: "wishlist",
      model: "Product",
      select: "name price discount images brand ratings stockQuantity", // choose fields you need
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      wishlist: user.wishlist || [],
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ---------------- ADD ADDRESS ----------------
// export const addAddress = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { address, addressType, isDefault } = req.body;

//     if (!address || !address.trim()) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Address is required" });
//     }

//     const newAddress = {
//       address: address.trim(),
//       addressType: addressType || "Home",
//       isDefault: !!isDefault,
//     };

//     // If new address is default, reset others
//     if (isDefault) {
//       await User.updateOne(
//         { _id: userId, "address.isDefault": true },
//         { $set: { "address.$[].isDefault": false } }
//       );
//     }

//     // Push the new address safely
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $push: { address: newAddress } },
//       { new: true, runValidators: true }
//     );

//     if (!updatedUser) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Address added successfully",
//       addresses: updatedUser.address,
//     });
//   } catch (error) {
//     console.error("Error adding address:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };


// // ---------------- GET ALL ADDRESSES ----------------
// export const getAllAddresses = async (req, res) => {
//   try {
//     const userId = req.userId;

//     const user = await User.findById(userId).select("address");
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({
//       success: true,
//       addresses: user.address || [],
//     });
//   } catch (error) {
//     console.error("Error fetching addresses:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };

// // ---------------- UPDATE ADDRESS ----------------
// export const updateAddress = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { addressId } = req.params;
//     const { address, addressType, isDefault } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // if isDefault true -> reset others first
//     if (isDefault) {
//       await User.updateOne(
//         { _id: userId, "address.isDefault": true },
//         { $set: { "address.$[].isDefault": false } }
//       );
//     }

//     // Update specific address
//     const updated = await User.findOneAndUpdate(
//       { _id: userId, "address._id": addressId },
//       {
//         $set: {
//           "address.$.address": address,
//           "address.$.addressType": addressType,
//           "address.$.isDefault": isDefault,
//         },
//       },
//       { new: true }
//     );

//     if (!updated) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Address not found" });
//     }

//     const addr = updated.address.id(addressId);

//     res.status(200).json({
//       success: true,
//       message: "Address updated successfully",
//       address: addr,
//     });
//   } catch (error) {
//     console.error("Error updating address:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };

// // ---------------- DELETE ADDRESS ----------------
// export const deleteAddress = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { addressId } = req.params;

//     const updated = await User.findByIdAndUpdate(
//       userId,
//       { $pull: { address: { _id: addressId } } },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Address deleted successfully",
//       addresses: updated.address,
//     });
//   } catch (error) {
//     console.error("Error deleting address:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };


export const addAddress = async (req, res) => {
  try {
    const userId = req.userId; // from verifyToken middleware
    const { roomNo, street, city, state, pinCode, country, landmark, addressType, isDefault } = req.body;

    if (!street || !city || !state || !pinCode || !country) {
      return res.status(400).json({
        success: false,
        message: "Street, City, State, Pin Code, and Country are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If isDefault = true, reset others
    if (isDefault) {
      user.address.forEach((addr) => (addr.isDefault = false));
    }

    user.address.push({ roomNo, street, city, state, pinCode, country, landmark, addressType, isDefault });
    await user.save();

    res.status(200).json({
      success: true,
      message: "Address added successfully",
      addresses: user.address,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ---------------- GET ALL ADDRESSES ----------------
export const getAllAddresses = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("address");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      addresses: user.address || [],
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ---------------- UPDATE ADDRESS ----------------
export const updateAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressId } = req.params;
    const { roomNo, street, city, state, pinCode, country, landmark, addressType, isDefault } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const address = user.address.id(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    // update only provided fields
    if (roomNo) address.roomNo = roomNo;
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pinCode) address.pinCode = pinCode;
    if (country) address.country = country;
    if (landmark) address.landmark = landmark;
    if (addressType) address.addressType = addressType;

    // If updating default, reset others
    if (typeof isDefault !== "undefined" && isDefault) {
      user.address.forEach((addr) => (addr.isDefault = false));
      address.isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ---------------- DELETE ADDRESS ----------------
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const address = user.address.id(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    address.deleteOne();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.address,
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};