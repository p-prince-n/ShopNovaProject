import express from 'express';
import {createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, searchCategory, getCategories, getRootCategories} from '../Controller/category.controller.js'
import {isAdmin, verifyToken} from '../middleware/verifyToken.js';

const categoryRouter=express.Router();

// Category Routes
categoryRouter.post("/create", verifyToken, isAdmin, createCategory);        // Create category
categoryRouter.get("/getCategories", verifyToken, isAdmin, getCategories);   
categoryRouter.get("/getAll", getAllCategories);       // Get all categories
categoryRouter.get("/getOnly/:id", getCategoryById);     // Get single category
categoryRouter.put("/update/:id", verifyToken, isAdmin, updateCategory);      // Update category
categoryRouter.delete("/delete/:id", verifyToken, isAdmin, deleteCategory);   // Delete category
categoryRouter.get("/search/:value", searchCategory);
categoryRouter.get("/getRootCategory", getRootCategories);

export default categoryRouter;
