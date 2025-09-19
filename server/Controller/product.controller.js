import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Review from "../models/review.model.js";
import mongoose from "mongoose";

import QrCodeReader from "qrcode-reader";
import fs from "fs";

import axios from "axios";

// 📌 Create Product
// export const createProduct = async (req, res) => {
//   try {
//     const { name, description, price, discount, stockQuantity, images, categories, brand, attributes } = req.body;

//     //  Validate required fields
//     if (!name || !price || !stockQuantity || !categories || categories.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, price, stockQuantity, and at least one category are required",
//       });
//     }

//     //  Validate price and stock
//     if (price <= 0) {
//       return res.status(400).json({ success: false, message: "Price must be greater than 0" });
//     }
//     if (stockQuantity < 0) {
//       return res.status(400).json({ success: false, message: "Stock quantity cannot be negative" });
//     }

//     //  Validate categories exist
//     const validCategories = await Category.find({ _id: { $in: categories } });
//     if (validCategories.length !== categories.length) {
//       return res.status(400).json({ success: false, message: "Invalid categories provided" });
//     }

//     const product = new Product({
//       name,
//       description,
//       price,
//       discount: discount || 0,
//       stockQuantity,
//       images: images || [],
//       categories,
//       brand,
//       attributes,
//     });

//     const savedProduct = await product.save();
//     res.status(201).json({ success: true, message: "Product created successfully", data: savedProduct });

//   } catch (error) {
//     //  Handle CastError (invalid ObjectId)
//     if (error.name === "CastError") {
//       return res.status(400).json({ success: false, message: "Invalid category or product ID format" });
//     }
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };

// 📌 Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      stockQuantity,
      images,
      categories,
      brand,
      attributes,
      size,
      material,
      expiryDate,
      isPerishable,
      ingredients,
      weatherTags,       // ✅ add this
      famousInCities     // ✅ add this
    } = req.body;

    // Validate required fields
    if (!name || !price || !stockQuantity || !categories || categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name, price, stockQuantity, and at least one category are required",
      });
    }

    if (price <= 0) return res.status(400).json({ success: false, message: "Price must be greater than 0" });
    if (stockQuantity < 0) return res.status(400).json({ success: false, message: "Stock quantity cannot be negative" });

    // Validate categories exist
    const validCategories = await Category.find({ _id: { $in: categories } });
    if (validCategories.length !== categories.length) {
      return res.status(400).json({ success: false, message: "Invalid categories provided" });
    }

    const product = new Product({
      name,
      description,
      price,
      discount: discount || 0,
      stockQuantity,
      images: images || [],
      categories,
      brand,
      attributes,
      size: size || [],
      material,
      expiryDate,
      isPerishable: isPerishable || false,
      ingredients: ingredients || [],
      weatherTags: weatherTags || [],      // ✅ default empty array
      famousInCities: famousInCities || [] // ✅ default empty array
    });

    const savedProduct = await product.save();
    res.status(201).json({ success: true, message: "Product created successfully", data: savedProduct });

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid category or product ID format" });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



//  Get All Products
export const getAllProducts = async (req, res) => {
  try {
     const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDir = req.query.sort === 'asc' ? 1 : -1;
    const totalProducts=await Product.find().countDocuments();
    const products = await Product.find().populate("categories", "name description").sort({ createdAt: sortDir }).skip(startIndex).limit(limit);;
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found" });
    }
    res.status(200).json({ success: true, count: products.length, data: products, totalProducts  });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

//  Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categories", "name description");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid product ID format" });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

//  Update Product
// export const updateProduct = async (req, res) => {
//   try {
//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({ success: false, message: "Update data cannot be empty" });
//     }

//     const { categories } = req.body;

//     if (categories) {
//       const validCategories = await Category.find({ _id: { $in: categories } });
//       if (validCategories.length !== categories.length) {
//         return res.status(400).json({ success: false, message: "Invalid categories provided" });
//       }
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     }).populate("categories", "name description");

//     if (!updatedProduct) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }

//     res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct });
//   } catch (error) {
//     if (error.name === "CastError") {
//       return res.status(400).json({ success: false, message: "Invalid product ID format" });
//     }
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };

// 📌 Update Product
export const updateProduct = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "Update data cannot be empty" });
    }

    const { categories, weatherTags, famousInCities } = req.body;

    if (categories) {
      const validCategories = await Category.find({ _id: { $in: categories } });
      if (validCategories.length !== categories.length) {
        return res.status(400).json({ success: false, message: "Invalid categories provided" });
      }
    }

    const updateFields = { ...req.body };

    // Optional: validate weatherTags against enum
    const WEATHER_TYPES = ["Clear", "Clouds", "Rain", "Snow", "Drizzle", "Thunderstorm", "Mist", "Fog", "Haze"];
    if (weatherTags && !weatherTags.every(tag => WEATHER_TYPES.includes(tag))) {
      return res.status(400).json({ success: false, message: `weatherTags must be one of: ${WEATHER_TYPES.join(", ")}` });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("categories", "name description");

    if (!updatedProduct) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid product ID format" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


//  Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid product ID format" });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// Search product by any field using route param
export const searchProductsByParam = async (req, res) => {
  try {
    const { term } = req.params; // get search term from URL

    if (!term) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const regex = new RegExp(term, "i"); // case-insensitive partial match

    // Find category IDs that match the term
    const categories = await Category.find({ name: regex });
    const categoryIds = categories.map((c) => c._id);

    // Search products across multiple fields
    const products = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
        { brand: regex },
        { "attributes.key": regex },
        { "attributes.value": regex },
        { categories: { $in: categoryIds } },
      ],
    }).populate("categories", "name");

    if (products.length === 0) {
      return res.status(404).json({ message: "No matching products found" });
    }

    res.status(200).json({ success: true, message: "Product Search successfully", data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


export const getProducts = async (req, res, next) => {
  try {


    const totalProducts = await Product.countDocuments();
    const now = new Date();
    const oneMonthAgoDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    )
    const lastMonthsProduct = await Product.countDocuments({ createdAt: { $gte: oneMonthAgoDate } });

    return res.status(200).json({ totalProducts, lastMonthsProduct, success: true });

  }
  catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
}



// 📌 Get Top 6 Products by Category Name with Max Discount First


export const getProductsByCategoryWithMaxDiscount = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const limit = parseInt(req.query.limit) || 6;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // Find category by ID
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Fetch products under this category sorted by discount (highest first), limited to 6
    const products = await Product.find({ categories: category._id })
      .populate("categories", "name")
      .sort({ discount: -1, createdAt: -1 })

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found for this category",
      });
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



// ✅ Get all products in random order
export const getRandomProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const products = await Product.aggregate([{ $sample: { size: count } }]);

    // size: 50 → number of random products to return (set as you need, or use count)

    res.status(200).json({products, totalProducts:count});
  } catch (error) {
    console.error("Error fetching random products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/products/:id/rate
export const updateProductRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.userId; // from verifyToken middleware

    if (rating === undefined || rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 0 and 5" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingRatingIndex = product.userRatings.findIndex(
      (r) => r.userId.toString() === userId
    );

    if (existingRatingIndex >= 0) {
      // Update existing rating
      product.userRatings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      product.userRatings.push({ userId, rating });
      product.ratingsCount += 1;
    }

    // Recalculate average rating
    const total = product.userRatings.reduce((acc, curr) => acc + curr.rating, 0);
    product.ratings = total / product.userRatings.length;

    await product.save();

    return res.status(200).json({
      message: "Rating updated successfully",
      ratings: product.ratings,
      ratingsCount: product.ratingsCount
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategories = async (req, res) => {
  try {
    const { categories } = req.body;

    // ✅ Validate categories input
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: "Category IDs are required" });
    }

    // ✅ Convert category IDs to ObjectId safely
    const validCategoryIds = categories
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    if (validCategoryIds.length === 0) {
      return res.status(400).json({ message: "Invalid Category IDs" });
    }

    // ✅ Fetch all matching products in random order
    const products = await Product.aggregate([
      { $match: { categories: { $in: validCategoryIds } } },
      { $sample: { size: 1000 } } // adjust max number if needed
    ]);

    // ✅ Populate categories after aggregation
    const populatedProducts = await Product.populate(products, {
      path: "categories",
      select: "name image",
    });

    res.status(200).json({
      success: true,
      count: populatedProducts.length,
      products: populatedProducts,
    });
  } catch (error) {
    console.error("Error fetching products by categories:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getProductsRatedByMe = async (req, res) => {
  try {
    const userId = req.userId;

    // Find all products where userRatings contains this userId
    const products = await Product.find({
      "userRatings.userId": userId
    });

    res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products rated by user",
      error: error.message,
    });
  }
};

export const getMyRatings = async (req, res) => {
  try {
    const userId = req.userId;

    // Find all products where the user has rated
    const products = await Product.find({ "userRatings.userId": userId }).select(
      "name ratings userRatings"
    );

    // Map product to include only the rating by this user
    const data = products.map((prod) => {
      const myRatingObj = prod.userRatings.find(
        (r) => r.userId.toString() === userId
      );
      return {
        _id: prod._id,
        name: prod.name,
        myRating: myRatingObj ? myRatingObj.rating : 0,
        overallRating: prod.ratings,
        ratingsCount: prod.ratingsCount,
      };
    });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductsReviewedByMe = async (req, res) => {
  try {
    const userId = req.userId;

    // Find all reviews by this user
    const reviews = await Review.find({ user: userId }).select("product");

    const productIds = reviews.map(r => r.product);

    // Fetch product details
    const products = await Product.find({ _id: { $in: productIds } });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products reviewed by you",
      error: error.message,
    });
  }
};




// Helper to decode QR code
const decodeQRCode = async (filePath) => {
  const Jimp = await import("jimp"); // dynamic import
  const img = await Jimp.default.read(filePath); // ✅ latest syntax
  const qr = new QrCodeReader();

  return new Promise((resolve, reject) => {
    qr.callback = (err, value) => {
      if (err) return reject(err);
      resolve(value.result);
    };
    qr.decode(img.bitmap);
  });
};
// Controller to handle QR upload
export const uploadQRCode = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    // Decode QR code
    const qrData = await decodeQRCode(req.file.path);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // QR contains JSON array of product IDs
    const productIds = JSON.parse(qrData);

    // Fetch products from DB
    const products = await Product.find({ _id: { $in: productIds } }).populate("categories");

    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params; // category id
    const { limit } = req.query; // optional ?limit=10

    // Count how many products belong to this category
    const count = await Product.countDocuments({ categories: id });

    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this category",
        products: [],
      });
    }

    // Decide how many products to fetch
    const size = limit ? Math.min(parseInt(limit), count) : count;

    // Use aggregation with $sample for randomness
    const products = await Product.aggregate([
      { $match: { categories: new mongoose.Types.ObjectId(id) } },
      { $sample: { size } },
    ]);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      totalProducts: count,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};




// GET /api/products/by-current-weather?city=CityName
export const getProductsByCurrentWeather = async (req, res) => {
  try {
    const { city } = req.params; 

    if (!city) {
      return res.status(400).json({ success: false, message: "City is required" });
    }

    // ✅ Call OpenWeatherMap API
    const apiKey = process.env.OPENWEATHER_API_KEY; // put your API key in .env
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    );

    const weatherData = weatherResponse.data;
    const weatherMain = weatherData.weather[0].main; // e.g., "Clear", "Rain", "Clouds"
    console.log({weatherMain});
    

    // ✅ Fetch products with matching weatherTags
    const products = await Product.find({ weatherTags: weatherMain }).populate("categories", "name");

    if (!products.length) {
      return res.status(404).json({ success: false, message: `No products found for current weather: ${weatherMain}` });
    }

    res.status(200).json({
      success: true,
      city,
      currentWeather: weatherMain,
      count: products.length,
      products,
    });

  } catch (error) {
    console.error("Error fetching products by current weather:", error.message);

    if (error.response && error.response.status === 404) {
      return res.status(404).json({ success: false, message: "City not found in OpenWeatherMap API" });
    }

    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const getProductsByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ success: false, message: "City name is required" });
    }

    // Case-insensitive search for products famous in the city
    const products = await Product.find({
      famousInCities: { $regex: new RegExp(`^${city}$`, "i") }
    }).populate("categories", "name description");

    if (!products.length) {
      return res.status(404).json({ success: false, message: `No products found for city: ${city}` });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error("Error fetching products by city:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};