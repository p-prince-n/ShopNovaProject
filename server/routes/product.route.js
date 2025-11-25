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
    updateProductRating,
    getProductsByCategories,
    getProductsRatedByMe,
    getMyRatings,
    getProductsReviewedByMe,
   uploadQRCode,
   getProductsByCategory, 
    getProductsByCity,
    getProductsByCurrentWeather ,
    searchProducts,
    exportProductsToExcel
} from '../Controller/product.controller.js';
import { isAdmin, verifyToken } from '../middleware/verifyToken.js';
import multer from "multer";

const productRouter = express.Router();
const upload = multer({ dest: "uploads/" });



productRouter.post("/create", verifyToken, isAdmin, createProduct);
productRouter.get("/getProducts", verifyToken, isAdmin, getProducts);  
productRouter.get("/downloadInExcelProduct", verifyToken, isAdmin, exportProductsToExcel);     
productRouter.get("/getAll", getAllProducts);
productRouter.get("/getOne/:id", getProductById);
productRouter.put("/update/:id", verifyToken, isAdmin, updateProduct);
productRouter.delete("/delete/:id", verifyToken, isAdmin, deleteProduct);
productRouter.get("/search/:term", searchProductsByParam);
productRouter.get("/category/discount/:categoryId", getProductsByCategoryWithMaxDiscount);
productRouter.get("/getRandomProducts", getRandomProducts);
productRouter.get("/search", searchProducts);


productRouter.put("/rate/:id", verifyToken, updateProductRating);


productRouter.post("/by-categories", getProductsByCategories);


productRouter.get("/rated-by-me", verifyToken, getProductsRatedByMe);
productRouter.get("/my-ratings", verifyToken, getMyRatings);
productRouter.get("/reviewed-by-me", verifyToken, getProductsReviewedByMe);


productRouter.post("/upload-qr", upload.single("qrFile"), uploadQRCode);
productRouter.get("/category/:id", getProductsByCategory);
productRouter.get("/by-weather/:city", getProductsByCurrentWeather);
productRouter.get("/by-city/:city", getProductsByCity);
export default productRouter;
