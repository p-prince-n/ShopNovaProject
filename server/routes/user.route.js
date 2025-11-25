import express from 'express';
import { isAdmin, verifyToken } from '../middleware/verifyToken.js';
import { getUsers, deleteUser, exportUsersToExcel } from '../Controller/user.controller.js';

const userRouter = express.Router();


userRouter.get('/getUsers', verifyToken, isAdmin, getUsers);
userRouter.get('/downloadUsers', verifyToken, isAdmin, exportUsersToExcel);
userRouter.delete('/delete/:id', verifyToken, deleteUser);



export default userRouter;
