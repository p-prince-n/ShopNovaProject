// controllers/recommendation.controller.js
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Get recommendations based on user's past purchases
export const getPurchaseBasedRecommendations = async (req, res) => {
  try {
    const userId = req.userId;

    // 1️⃣ Get all user's purchased products
    const orders = await Order.find({ user: userId }).populate("items.product");
    const purchasedProductIds = orders.flatMap(order => order.items.map(item => item.product._id));

    if (purchasedProductIds.length === 0) {
      return res.json({ success: true, recommendedProducts: [] });
    }

    // 2️⃣ Get categories of purchased products
    const purchasedCategories = orders.flatMap(order =>
      order.items.flatMap(item => item.product.categories)
    );

    // 3️⃣ Find products in the same categories but not yet purchased
    const recommendedProducts = await Product.find({
      categories: { $in: purchasedCategories },
      _id: { $nin: purchasedProductIds }
    })
      .sort({ ratingsCount: -1 }) // optional: sort by popularity
      .limit(10);

    res.json({ success: true, recommendedProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase-based recommendations",
      error: err.message,
    });
  }
};
