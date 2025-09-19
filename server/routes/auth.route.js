import express from 'express';
import { 
  signIn,  
  signUp, 
  signOut, 
  verifyEmail, 
  resetPassword, 
  forgetPassword,  
  checkAuth,
  updateUser, 
  verifyMobile, 
  resendEmailVerification, 
  resendMobileVerification, 
  toggleWishlist,
  getWishlist,
  addAddress,          // ⬅️ import addAddress
  getAllAddresses,      // ⬅️ import getAllAddresses
  updateAddress,
  deleteAddress,
} from '../Controller/auth.controller.js';

import { verifyToken } from '../middleware/verifyToken.js';

const authRouter = express.Router();

authRouter.get('/check-auth', verifyToken, checkAuth);
authRouter.post('/signUp', signUp);
authRouter.post('/signIn', signIn);
authRouter.post('/signOut', signOut);
authRouter.post('/verifyEmail', verifyEmail);
authRouter.post('/verifyPhone', verifyMobile);
authRouter.post('/forgotPassword', forgetPassword);
authRouter.post('/reset-password/:resetToken', resetPassword);
authRouter.patch('/update-profile', verifyToken, updateUser);
authRouter.post('/resend-mobile-code', verifyToken, resendMobileVerification);
authRouter.post('/resend-email-code', verifyToken, resendEmailVerification);

// ✅ Wishlist routes
authRouter.get('/wishlist', verifyToken, getWishlist);
authRouter.post('/wishlist/toggle', verifyToken, toggleWishlist);

// ✅ Address routes
authRouter.post('/addresses', verifyToken, addAddress);
authRouter.get('/addresses', verifyToken, getAllAddresses);

authRouter.put("/addresses/:addressId", verifyToken, updateAddress);
authRouter.delete("/addresses/:addressId", verifyToken, deleteAddress);

export default authRouter;
