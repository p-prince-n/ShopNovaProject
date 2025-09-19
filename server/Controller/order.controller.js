// controllers/order.controller.js
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Seller from "../models/seller.model.js";
import mongoose from "mongoose";
import Category from "../models/category.model.js";

import { sendMobileVerificationCode } from "../utils/sms.js";


export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("items.product", "name price images description")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getUserOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("items.product", "name price images")
      .populate("items.seller", "storeName email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to view this order" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const cancelUserOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this order" });
    }

    if (["Shipped", "Delivered", "Cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: "Order cannot be cancelled at this stage" });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    // ✅ Restore stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: item.quantity },
      });
    }

    res.status(200).json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("❌ Error cancelling order:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const seller = await Seller.findById(req.sellerId).populate("categories");

    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller account not found" });
    }

    if (!seller.isVerifiedSeller) {
      return res.status(403).json({ success: false, message: "Seller is not verified" });
    }

    const orders = await Order.find({ "items.seller": seller._id })
      .populate({
        path: "items.product",
        populate: { path: "categories", model: "Category" },
      })
      .populate("user", "name email mobileNumber")
      .sort({ createdAt: -1 });

    // Optional: filter only seller’s categories
    const sellerCategoryIds = seller.categories.map((cat) => cat.toString());

    const filteredOrders = orders
      .map((order) => {
        const filteredItems = order.items.filter((item) => {
          const productCategories = item.product.categories.map((c) => c.toString());
          return productCategories.some((catId) => sellerCategoryIds.includes(catId));
        });

        return filteredItems.length > 0
          ? {
            _id: order._id,
            user: order.user,
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
            orderStatus: order.orderStatus,
            createdAt: order.createdAt,
            items: filteredItems,
          }
          : null;
      })
      .filter((order) => order !== null);

    res.status(200).json({ success: true, orders: filteredOrders });
  } catch (error) {
    console.error("❌ Error fetching seller orders:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price images")
      .populate("items.seller", "storeName email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// export const createOrder = async (req, res) => {
//   try {
//     const { items, shippingAddress, paymentMethod, transactionId } = req.body;

//     if (!items || items.length === 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No items in order" });
//     }

//     const orderItems = [];

//     for (let item of items) {
//       const product = await Product.findById(item.product);
//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: `Product not found: ${item.product}`,
//         });
//       }

//       if (product.stockQuantity < item.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Not enough stock for ${product.name}`,
//         });
//       }

//       // reduce stock
//       product.stockQuantity -= item.quantity;
//       await product.save();

//       orderItems.push({
//         product: product._id,
//         quantity: item.quantity,
//         price: product.price,
//         discount: product.discount || 0,
//         discountPrice:
//           product.price - (product.price * (product.discount || 0)) / 100,
//         size: item.size || null,
//         orderStatus: "Pending", // ✅ every item starts as Pending
//       });
//     }

//     const order = new Order({
//       user: req.userId,
//       items: orderItems,
//       shippingAddress,
//       paymentMethod,
//       paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
//       transactionId: transactionId || null,
//     });

//     await order.save();

//     // send SMS if phone exists
//     if (req.userPhone) {
//       const message = `Your order #${order._id} has been placed successfully!`;
//       await sendMobileVerificationCode(req.userPhone, message);
//     }

//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("❌ Error creating order:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// ----------------------------
// Seller accepts order items

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, transactionId } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No items in order" });
    }

    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}`,
        });
      }

      // reduce stock
      product.stockQuantity -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        discount: product.discount || 0,
        discountPrice:
          product.price - (product.price * (product.discount || 0)) / 100,
        size: item.size || null,
        orderStatus: "Pending", // ✅ every item starts as Pending
      });
    }

    const order = new Order({
      user: req.userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      transactionId: transactionId || null,
    });

    await order.save();

    // send SMS if phone exists
    if (req.userPhone) {
      const message = `Your order #${order._id} has been placed successfully!`;
      await sendMobileVerificationCode(req.userPhone, message);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// export const sellerAcceptOrder = async (req, res) => {
//   try {
//     // find seller
//     const seller = await Seller.findById(req.sellerId);
//     if (!seller)
//       return res.status(404).json({ success: false, message: "Seller not found" });

//     if (!seller.isVerifiedSeller) {
//       return res
//         .status(403)
//         .json({ success: false, message: "Only verified sellers can accept orders" });
//     }

//     // populate items.product and user
//     const order = await Order.findById(req.params.orderId)
//       .populate("items.product")
//       .populate("user"); // <-- populate user to get mobileNumber

//     if (!order)
//       return res.status(404).json({ success: false, message: "Order not found" });

//     let accepted = false;
//     order.items = order.items.map((item) => {
//       const productCategoryIds = item.product.categories.map((c) => c.toString());
//       const sellerCategoryIds = seller.categories.map((c) => c.toString());

//       if (!item.seller && productCategoryIds.some((cat) => sellerCategoryIds.includes(cat))) {
//         item.seller = seller._id;
//         accepted = true;
//       }
//       return item;
//     });

//     if (!accepted) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "No items in this order belong to your categories or already accepted",
//       });
//     }

//     order.orderStatus = "Processing";
//     await order.save();

//     // ✅ Send SMS to user using user.mobileNumber
//     if (order.user?.mobileNumber) {
//       const message = `Your order #${order._id} has been accepted by shop : ${seller.shopName}  and is now processing.`;
//       await sendMobileVerificationCode(order.user.mobileNumber, message);
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Order accepted by seller", order });
//   } catch (error) {
//     console.error("❌ Error accepting order:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };


export const sellerAcceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { productId } = req.body;
    if (!orderId || !productId) {
      return res.status(400).json({
        success: false,
        message: "orderId (params) and productId (body) are required",
      });
    }
    // find seller
    const seller = await Seller.findById(req.sellerId);
    if (!seller)
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });

    if (!seller.isVerifiedSeller) {
      return res.status(403).json({
        success: false,
        message: "Only verified sellers can accept orders",
      });
    }

    // populate items.product and user
    const order = await Order.findById(req.params.orderId)
      .populate("items.product")
      .populate("user");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    // find the specific item
    const item = order.items.find(
      (i) => i.product._id.toString() === productId.toString()
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "This product is not part of the order",
      });
    }

    // check if seller can accept this item
    const productCategoryIds = item.product.categories.map((c) =>
      c.toString()
    );
    const sellerCategoryIds = seller.categories.map((c) => c.toString());

    if (!productCategoryIds.some((cat) => sellerCategoryIds.includes(cat))) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this product",
      });
    }

    if (item.orderStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This item has already been accepted or processed",
      });
    }

    // update the orderStatus of this item only
    item.orderStatus = "Processing";
    await order.save();

    // notify user
    if (order.user?.mobileNumber) {
      const message = `Your order #${order._id} item "${item.product.name}" has been accepted by ${seller.shopName} and is now processing.`;
      await sendMobileVerificationCode(order.user.mobileNumber, message);
    }

    res.status(200).json({
      success: true,
      message: "Item accepted and marked as Processing",
      order,
    });
  } catch (error) {
    console.error("❌ Error accepting order:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// export const sellerShipOrder = async (req, res) => {
//   try {
//     // find seller
//     const seller = await Seller.findById(req.sellerId);
//     if (!seller)
//       return res.status(404).json({ success: false, message: "Seller not found" });

//     if (!seller.isVerifiedSeller) {
//       return res
//         .status(403)
//         .json({ success: false, message: "Only verified sellers can accept orders" });
//     }

//     // populate items.product and user
//     const order = await Order.findById(req.params.orderId)
//       .populate("items.product")
//       .populate("user"); // <-- populate user to get mobileNumber

//     if (!order)
//       return res.status(404).json({ success: false, message: "Order not found" });


//     order.orderStatus = "Shipped";
//     await order.save();

//     // ✅ Send SMS to user using user.mobileNumber
//     if (order.user?.mobileNumber) {
//       const message = `Your order #${order._id} has been Ship out by shop : ${seller.shopName}  and is now delivering.`;
//       await sendMobileVerificationCode(order.user.mobileNumber, message);
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Order accepted by seller", order });
//   } catch (error) {
//     console.error("❌ Error accepting order:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };
// ----------------------------









export const sellerShipOrder = async (req, res) => {
  try {
    const { productId } = req.body; // productId of the item seller wants to ship

    // find seller
    const seller = await Seller.findById(req.sellerId);
    if (!seller)
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });

    if (!seller.isVerifiedSeller) {
      return res.status(403).json({
        success: false,
        message: "Only verified sellers can update orders",
      });
    }

    // find order and populate products & user
    const order = await Order.findById(req.params.orderId)
      .populate("items.product")
      .populate("user");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    // find the specific item
    const item = order.items.find(
      (i) => i.product._id.toString() === productId.toString()
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "This product is not part of the order",
      });
    }

    // check if item is already shipped or delivered
    if (item.orderStatus !== "Processing") {
      return res.status(400).json({
        success: false,
        message: `This item cannot be shipped because its current status is "${item.orderStatus}"`,
      });
    }

    // update only this item's orderStatus
    item.orderStatus = "Shipped";
    await order.save();

    // notify user
    if (order.user?.mobileNumber) {
      const message = `Your order #${order._id} item "${item.product.name}" has been shipped by ${seller.shopName} and is on its way.`;
      await sendMobileVerificationCode(order.user.mobileNumber, message);
    }

    res.status(200).json({
      success: true,
      message: "Item marked as Shipped",
      order,
    });
  } catch (error) {
    console.error("❌ Error shipping order item:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Update order status (Admin/Seller)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingInfo } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (status) order.orderStatus = status;
    if (trackingInfo) order.trackingInfo = { ...order.trackingInfo, ...trackingInfo };

    await order.save();

    // ✅ Send SMS notification to user
    if (order.userPhone) {
      const message = `Your order #${order._id} status has been updated to "${order.orderStatus}".`;
      await sendMobileVerificationCode(order.userPhone, message);
    }

    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// controllers/order.controller.js


async function expandCategoryIds(categoryIds) {
  let allIds = new Set();

  for (let catId of categoryIds) {
    let current = await Category.findById(catId).lean();
    while (current) {
      allIds.add(current._id.toString());
      if (!current.parentCategory) break;
      current = await Category.findById(current.parentCategory).lean();
    }
  }

  return Array.from(allIds);
}






// GET seller pending orders (items with orderStatus "Pending")
export const getSellerPendingOrders = async (req, res) => {
  try {
    const seller = await Seller.findById(req.sellerId).populate("categories");
    if (!seller)
      return res.status(404).json({ success: false, message: "Seller not found" });

    if (!seller.isVerifiedSeller)
      return res
        .status(403)
        .json({ success: false, message: "Seller is not verified" });

    const sellerCategoryIds = await expandCategoryIds(
      seller.categories.map((c) => c._id.toString())
    );

    const orders = await Order.find()
      .populate({
        path: "items.product",
        populate: {
          path: "categories",
          model: "Category",
          select: "name description image parentCategory",
        },
      })
      .populate("user", "name email mobileNumber")
      .sort({ createdAt: -1 });

    const filteredOrders = [];

    for (const order of orders) {
      const matchedItems = [];

      for (const item of order.items) {
        if (!item.product) continue;

        const productCategoryIds = await expandCategoryIds(
          item.product.categories.map((c) => c._id.toString())
        );

        // ✅ Only include items that match seller categories AND are "Pending"
        if (
          item.orderStatus === "Pending" &&
          productCategoryIds.some((id) => sellerCategoryIds.includes(id))
        ) {
          matchedItems.push(item);
        }
      }

      if (matchedItems.length > 0) {
        filteredOrders.push({
          _id: order._id,
          user: order.user,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
          items: matchedItems,
        });
      }
    }

    res.status(200).json({ success: true, orders: filteredOrders });
  } catch (error) {
    console.error("❌ Error fetching seller pending orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET seller shipping pending orders (items with orderStatus "Processing")
export const getSellerShippingPendingOrders = async (req, res) => {
  try {
    const seller = await Seller.findById(req.sellerId).populate("categories");
    if (!seller)
      return res.status(404).json({ success: false, message: "Seller not found" });

    if (!seller.isVerifiedSeller)
      return res
        .status(403)
        .json({ success: false, message: "Seller is not verified" });

    const sellerCategoryIds = await expandCategoryIds(
      seller.categories.map((c) => c._id.toString())
    );

    const orders = await Order.find()
      .populate({
        path: "items.product",
        populate: {
          path: "categories",
          model: "Category",
          select: "name description image parentCategory",
        },
      })
      .populate("user", "name email mobileNumber")
      .sort({ createdAt: -1 });

    const filteredOrders = [];

    for (const order of orders) {
      const matchedItems = [];

      for (const item of order.items) {
        if (!item.product) continue;

        const productCategoryIds = await expandCategoryIds(
          item.product.categories.map((c) => c._id.toString())
        );

        // ✅ Only include items that match seller categories AND are "Processing"
        if (
          item.orderStatus === "Processing" &&
          productCategoryIds.some((id) => sellerCategoryIds.includes(id))
        ) {
          matchedItems.push(item);
        }
      }

      if (matchedItems.length > 0) {
        filteredOrders.push({
          _id: order._id,
          user: order.user,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
          items: matchedItems,
        });
      }
    }

    res.status(200).json({ success: true, orders: filteredOrders });
  } catch (error) {
    console.error("❌ Error fetching seller shipping pending orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const getSellerPendingOrders = async (req, res) => {
//   try {
//     const seller = await Seller.findById(req.sellerId).populate("categories");

//     if (!seller) {
//       return res.status(404).json({ success: false, message: "Seller not found" });
//     }

//     if (!seller.isVerifiedSeller) {
//       return res.status(403).json({ success: false, message: "Seller is not verified" });
//     }

//     // ✅ Expand seller categories (include parents)
//     const sellerCategoryIds = await expandCategoryIds(
//       seller.categories.map((c) => c._id.toString())
//     );

//     // ✅ Get all pending orders
//     const orders = await Order.find({ orderStatus: "Pending" })
//       .populate({
//         path: "items.product",
//         populate: {
//           path: "categories",
//           model: "Category",
//           select: "name description image parentCategory"
//         }
//       })
//       .populate("user", "name email mobileNumber ")
//       .sort({ createdAt: -1 });

//     // ✅ Filter items
//     const filteredOrders = [];

//     for (const order of orders) {
//       const matchedItems = [];

//       for (const item of order.items) {
//         if (!item.product) continue;

//         // expand product categories (with parent chain)
//         const productCategoryIds = await expandCategoryIds(
//           item.product.categories.map((c) => c._id.toString())
//         );


//         // check match
//         if (productCategoryIds.some((id) => sellerCategoryIds.includes(id))) {
//           matchedItems.push(item);
//         }
//       }

//       if (matchedItems.length > 0) {
//         filteredOrders.push({
//           _id: order._id,
//           user: order.user,
//           shippingAddress: order.shippingAddress,
//           paymentMethod: order.paymentMethod,
//           orderStatus: order.orderStatus,
//           createdAt: order.createdAt,
//           items: matchedItems,
//         });
//       }
//     }

//     res.status(200).json({ success: true, orders: filteredOrders });
//   } catch (error) {
//     console.error("❌ Error fetching seller pending orders:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// export const getSellerShippingPendingOrders = async (req, res) => {
//   try {
//     const seller = await Seller.findById(req.sellerId).populate("categories");

//     if (!seller) {
//       return res.status(404).json({ success: false, message: "Seller not found" });
//     }

//     if (!seller.isVerifiedSeller) {
//       return res.status(403).json({ success: false, message: "Seller is not verified" });
//     }

//     // ✅ Expand seller categories (include parents)
//     const sellerCategoryIds = await expandCategoryIds(
//       seller.categories.map((c) => c._id.toString())
//     );

//     // ✅ Get all pending orders
//     const orders = await Order.find({ orderStatus: "Processing", "items.seller": seller._id })
//       .populate({
//         path: "items.product",
//         populate: {
//           path: "categories",
//           model: "Category",
//           select: "name description image parentCategory"
//         }
//       })
//       .populate("user", "name email mobileNumber ")
//       .sort({ createdAt: -1 });

//     // ✅ Filter items
//     const filteredOrders = [];

//     for (const order of orders) {
//       const matchedItems = [];

//       for (const item of order.items) {
//         if (!item.product) continue;

//         // expand product categories (with parent chain)
//         const productCategoryIds = await expandCategoryIds(
//           item.product.categories.map((c) => c._id.toString())
//         );


//         // check match
//         if (productCategoryIds.some((id) => sellerCategoryIds.includes(id))) {
//           matchedItems.push(item);
//         }
//       }

//       if (matchedItems.length > 0) {
//         filteredOrders.push({
//           _id: order._id,
//           user: order.user,
//           shippingAddress: order.shippingAddress,
//           paymentMethod: order.paymentMethod,
//           orderStatus: order.orderStatus,
//           createdAt: order.createdAt,
//           items: matchedItems,
//         });
//       }
//     }

//     res.status(200).json({ success: true, orders: filteredOrders });
//   } catch (error) {
//     console.error("❌ Error fetching seller pending orders:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };