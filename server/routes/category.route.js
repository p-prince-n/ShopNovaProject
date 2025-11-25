import express from 'express';
import {createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, searchCategory, getCategories, getRootCategories} from '../Controller/category.controller.js'
import {isAdmin, verifyToken} from '../middleware/verifyToken.js';

const categoryRouter=express.Router();


categoryRouter.post("/create", verifyToken, isAdmin, createCategory);
categoryRouter.get("/getCategories", verifyToken, isAdmin, getCategories);   
categoryRouter.get("/getAll", getAllCategories);
categoryRouter.get("/getOnly/:id", getCategoryById);
categoryRouter.put("/update/:id", verifyToken, isAdmin, updateCategory);
categoryRouter.delete("/delete/:id", verifyToken, isAdmin, deleteCategory);
categoryRouter.get("/search/:value", searchCategory);
categoryRouter.get("/getRootCategory", getRootCategories);

export default categoryRouter;
