import express from 'express';
import { isAdmin, verifyToken } from '../middleware/verifyToken.js';
import { getUsers, deleteUser } from '../Controller/user.controller.js'; // Import toggleWishlist

const userRouter = express.Router();

// ✅ User Routes
userRouter.get('/getUsers', verifyToken, isAdmin, getUsers);
userRouter.delete('/delete/:id', verifyToken, deleteUser);



export default userRouter;
