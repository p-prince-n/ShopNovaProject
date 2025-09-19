// controllers/seller.controller.js
import Seller from "../models/seller.model.js";
import User from "../models/auth.model.js";


// ✅ Create a seller profile
export const createSeller = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.isSeller) {
      return res.status(403).json({ success: false, message: "User is not marked as a seller" });
    }

    // check if seller profile already exists
    const existingSeller = await Seller.findOne({ user: userId });
    if (existingSeller) {
      return res.status(400).json({ success: false, message: "Seller profile already exists" });
    }

    const { shopName, shopDescription, categories, contactEmail, contactPhone, accountInfo, logo } = req.body;

    const newSeller = new Seller({
      user: userId,
      shopName,
      logo,
      shopDescription,
      categories,
      contactEmail,
      contactPhone,
      accountInfo,
    });

    await newSeller.save();

    res.status(201).json({
      success: true,
      message: "Seller profile created successfully",
      seller: newSeller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating seller profile",
      error: error.message,
    });
  }
};

// ✅ Update seller profile
export const updateSeller = async (req, res) => {
  try {
    const userId = req.userId;

    const seller = await Seller.findOne({ user: userId });
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller profile not found" });
    }

    const { shopName, shopDescription, categories, contactEmail, contactPhone, accountInfo, logo } = req.body;

    // update fields if provided
    if(logo) seller.logo=logo;
    if (shopName) seller.shopName = shopName;
    if (shopDescription) seller.shopDescription = shopDescription;
    if (categories) seller.categories = categories;
    if (contactEmail) seller.contactEmail = contactEmail;
    if (contactPhone) seller.contactPhone = contactPhone;
    if (accountInfo) seller.accountInfo = { ...seller.accountInfo, ...accountInfo };

    await seller.save();

    res.status(200).json({
      success: true,
      message: "Seller profile updated successfully",
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating seller profile",
      error: error.message,
    });
  }
};


export const verifySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Find seller profile
    const seller = await Seller.findById(sellerId).populate("user");
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    // Mark seller as verified
    seller.isVerifiedSeller = true;   // ✅ consistent field name
    await seller.save();

    // Also make sure linked user has seller role enabled
    if (seller.user && !seller.user.isSeller) {
      seller.user.isSeller = true;
      await seller.user.save();
    }

    res.status(200).json({
      success: true,
      message: "Seller verified successfully",
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying seller",
      error: error.message,
    });
  }
};

// Get Unverified Sellers
export const getUnverifiedSellers = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDir = req.query.sort === "asc" ? 1 : -1;

    // ✅ Fetch sellers where isVerified = false
    const sellers = await Seller.find({ isVerifiedSeller: false })
      .populate("user", "-password") // populate user info but exclude password
      .populate("categories")        // show category details
      .populate("products")          // show product details
      .sort({ createdAt: sortDir })
      .skip(startIndex)
      .limit(limit);

    const totalSellers = await Seller.countDocuments({ isVerified: false });

    const now = new Date();
    const oneMonthAgoDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthSellers = await Seller.countDocuments({
      isVerified: false,
      createdAt: { $gte: oneMonthAgoDate },
    });

    return res.status(200).json({
      data: sellers,
      totalSellers,
      lastMonthSellers,
      success: true,
    });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};


export const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.userId })
      .populate("user", "name email mobileNumber address isVerified") // only necessary user fields
      .populate("categories", "name") // if you want category names
      .populate("products", "name price"); // if you want product names

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching seller profile",
      error: error.message,
    });
  }
};

export const getVerifiedSellers = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDir = req.query.sort === "asc" ? 1 : -1;

    // ✅ Fetch sellers where isVerified = false
    const sellers = await Seller.find({ isVerifiedSeller: true })
      .populate("user", "-password") // populate user info but exclude password
      .populate("categories")        // show category details
      .populate("products")          // show product details
      .sort({ createdAt: sortDir })
      .skip(startIndex)
      .limit(limit);

    const totalSellers = await Seller.countDocuments({ isVerified: true });

    const now = new Date();
    const oneMonthAgoDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthSellers = await Seller.countDocuments({
      isVerified: true,
      createdAt: { $gte: oneMonthAgoDate },
    });

    return res.status(200).json({
      data: sellers,
      totalSellers,
      lastMonthSellers,
      success: true,
    });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};


// controllers/order.controller.js

// export const getSellerOrders = async (req, res) => {
//   try {
//     // ✅ use sellerId attached from middleware (auth.middleware.js -> isSeller)
//     const seller = await Seller.findById(req.sellerId).populate("categories");

//     if (!seller) {
//       return res.status(404).json({ success: false, message: "Seller account not found" });
//     }

//     if (!seller.isVerifiedSeller) {
//       return res.status(403).json({ success: false, message: "Seller is not verified" });
//     }

//     // ✅ fetch orders containing items sold by this seller
//     const orders = await Order.find({ "items.seller": seller._id })
//       .populate({
//         path: "items.product",
//         populate: { path: "categories", model: "Category" },
//       })
//       .populate("user", "name email") // buyer info
//       .sort({ createdAt: -1 });

//     // ✅ filter out only items that belong to seller’s categories
//     const sellerCategoryIds = seller.categories.map((cat) => cat.toString());

//     const filteredOrders = orders
//       .map((order) => {
//         const filteredItems = order.items.filter((item) => {
//           const productCategories = item.product.categories.map((c) => c.toString());
//           return productCategories.some((catId) => sellerCategoryIds.includes(catId));
//         });

//         return filteredItems.length > 0
//           ? {
//               _id: order._id,
//               user: order.user,
//               shippingAddress: order.shippingAddress,
//               paymentMethod: order.paymentMethod,
//               orderStatus: order.orderStatus,
//               createdAt: order.createdAt,
//               items: filteredItems,
//             }
//           : null;
//       })
//       .filter((order) => order !== null);

//     res.status(200).json({ success: true, orders: filteredOrders });
//   } catch (error) {
//     console.error("❌ Error fetching seller orders:", error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };
