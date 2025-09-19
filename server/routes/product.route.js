import express from 'express';
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    searchProductsByParam, 
    getProducts, 
    getProductsByCategoryWithMaxDiscount, 
    getRandomProducts,
    updateProductRating,   // ⭐ import rating controller
    getProductsByCategories, // ⭐ import new controller
    getProductsRatedByMe, // ⭐ import new controller
    getMyRatings,
    getProductsReviewedByMe,
   uploadQRCode,  // ⭐ import QR decode controller
   getProductsByCategory, 
    getProductsByCity,
    getProductsByCurrentWeather 
} from '../Controller/product.controller.js';
import { isAdmin, verifyToken } from '../middleware/verifyToken.js';
import multer from "multer";

const productRouter = express.Router();
const upload = multer({ dest: "uploads/" });


// Product routes
productRouter.post("/create", verifyToken, isAdmin, createProduct);
productRouter.get("/getProducts", verifyToken, isAdmin, getProducts);     
productRouter.get("/getAll", getAllProducts);
productRouter.get("/getOne/:id", getProductById);
productRouter.put("/update/:id", verifyToken, isAdmin, updateProduct);
productRouter.delete("/delete/:id", verifyToken, isAdmin, deleteProduct);
productRouter.get("/search/:term", searchProductsByParam);
productRouter.get("/category/discount/:categoryId", getProductsByCategoryWithMaxDiscount);
productRouter.get("/getRandomProducts", getRandomProducts);

// ⭐ New route to add/update rating
productRouter.put("/rate/:id", verifyToken, updateProductRating);

// ⭐ New route: get products by category IDs (expects { categories: [] } in body)
productRouter.post("/by-categories", getProductsByCategories);

// ⭐ New route: get products rated by logged-in user
productRouter.get("/rated-by-me", verifyToken, getProductsRatedByMe);
productRouter.get("/my-ratings", verifyToken, getMyRatings);
productRouter.get("/reviewed-by-me", verifyToken, getProductsReviewedByMe);

// ⭐ New route: upload QR code image and fetch product(s)
productRouter.post("/upload-qr", upload.single("qrFile"), uploadQRCode);
productRouter.get("/category/:id", getProductsByCategory);
productRouter.get("/by-weather/:city", getProductsByCurrentWeather);
productRouter.get("/by-city/:city", getProductsByCity);
export default productRouter;
