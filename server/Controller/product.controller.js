import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Review from "../models/review.model.js";
import mongoose from "mongoose";
import QrCodeReader from "qrcode-reader";
import fs from "fs";
import ExcelJS from "exceljs";
import path from "path";
import axios from "axios";


export const exportProductsToExcel = async (req, res) => {
  try {
    const products = await Product.find().populate("categories");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");


    worksheet.columns = [
      { header: "ID", key: "_id", width: 24 },
      { header: "Name", key: "name", width: 30 },
      { header: "Image URL", key: "imageurl", width: 60 },
      { header: "Description", key: "description", width: 60 },
      { header: "Price", key: "price", width: 10 },
      { header: "Discount", key: "discount", width: 10 },
      { header: "Stock Quantity", key: "stockQuantity", width: 15 },
      { header: "Brand", key: "brand", width: 15 },
      { header: "Weather Tags", key: "weatherTags", width: 25 },
      { header: "Famous in Cities", key: "famousInCities", width: 25 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Updated At", key: "updatedAt", width: 20 },
    ];


    products.forEach((p, index) => {
      worksheet.addRow({
        _id: p._id.toString(),
        name: p.name,
        imageurl: p.images[0],
        description: p.description || "",
        price: p.price,
        discount: p.discount,
        stockQuantity: p.stockQuantity,
        brand: p.brand || "",
        weatherTags:p.weatherTags.length>0? p.weatherTags.join(", "): 'Not Assigned Yet',
        famousInCities:p.famousInCities.length>0? p.famousInCities.join(", "): 'Not Assigned Yet',
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      });

      
    });


    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=products.xlsx"
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
      weatherTags,
      famousInCities
    } = req.body;


    if (!name || !price || !stockQuantity || !categories || categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name, price, stockQuantity, and at least one category are required",
      });
    }

    if (price <= 0) return res.status(400).json({ success: false, message: "Price must be greater than 0" });
    if (stockQuantity < 0) return res.status(400).json({ success: false, message: "Stock quantity cannot be negative" });


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
      weatherTags: weatherTags || [],
      famousInCities: famousInCities || []
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



export const searchProductsByParam = async (req, res) => {
  
  try {
    const { term } = req.params;

    if (!term) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const regex = new RegExp(term, "i");


    const categories = await Category.find({ name: regex });
    const categoryIds = categories.map((c) => c._id);


    const products = await Product.find({
      $or: [
        { name: regex },
        { brand: regex },
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






export const getProductsByCategoryWithMaxDiscount = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const limit = parseInt(req.query.limit) || 6;


    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }


    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }


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




export const getRandomProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const products = await Product.aggregate([{ $sample: { size: count } }]);



    res.status(200).json({products, totalProducts:count});
  } catch (error) {
    console.error("Error fetching random products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateProductRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.userId;

    if (rating === undefined || rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 0 and 5" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingRatingIndex = product.userRatings.findIndex(
      (r) => r.userId.toString() === userId
    );

    if (existingRatingIndex >= 0) {

      product.userRatings[existingRatingIndex].rating = rating;
    } else {

      product.userRatings.push({ userId, rating });
      product.ratingsCount += 1;
    }


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


    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: "Category IDs are required" });
    }


    const validCategoryIds = categories
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    if (validCategoryIds.length === 0) {
      return res.status(400).json({ message: "Invalid Category IDs" });
    }


    const products = await Product.aggregate([
      { $match: { categories: { $in: validCategoryIds } } },
      { $sample: { size: 1000 } }
    ]);


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


    const products = await Product.find({ "userRatings.userId": userId }).select(
      "name ratings userRatings"
    );


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


    const reviews = await Review.find({ user: userId }).select("product");

    const productIds = reviews.map(r => r.product);


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





const decodeQRCode = async (filePath) => {
  const Jimp = await import("jimp");
  const img = await Jimp.default.read(filePath);
  const qr = new QrCodeReader();

  return new Promise((resolve, reject) => {
    qr.callback = (err, value) => {
      if (err) return reject(err);
      resolve(value.result);
    };
    qr.decode(img.bitmap);
  });
};

export const uploadQRCode = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });


    const qrData = await decodeQRCode(req.file.path);


    fs.unlinkSync(req.file.path);


    const productIds = JSON.parse(qrData);


    const products = await Product.find({ _id: { $in: productIds } }).populate("categories");

    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit } = req.query;


    const count = await Product.countDocuments({ categories: id });

    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this category",
        products: [],
      });
    }


    const size = limit ? Math.min(parseInt(limit), count) : count;


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





export const getProductsByCurrentWeather = async (req, res) => {
  try {
    const { city } = req.params; 

    if (!city) {
      return res.status(400).json({ success: false, message: "City is required" });
    }


    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    );

    const weatherData = weatherResponse.data;
    const weatherMain = weatherData.weather[0].main;
    console.log({weatherMain});
    


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


export const searchProducts = async (req, res) => {
  try {
    const { categoryId, name } = req.query;

    let filter = {};


    if (categoryId) {
      filter.categories = categoryId;
    }


    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }


    const products = await Product.find(filter)
      .populate("categories", "name")
      .lean();


    const productsWithReviewCount = await Promise.all(
      products.map(async (product) => {
        const reviewsCount = await Review.countDocuments({ product: product._id });
        return {
          ...product,
          reviewsCount,
        };
      })
    );

    res.json({
      success: true,
      products: productsWithReviewCount,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
