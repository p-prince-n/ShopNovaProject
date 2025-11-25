
import Order from "../models/order.model.js";
import XLSX from "xlsx";
import Product from "../models/product.model.js";
import Seller from "../models/seller.model.js";
import Spin from "../models/spin.model.js"
import Category from "../models/category.model.js";
import DeliveryMan from "../models/delivery.model.js";
import { sendItemDeliveryOTPEmail, sendOrderStatusUpdateEmail } from "../mailTrap/email.js";

import { sendMobileVerificationCode } from "../utils/sms.js";


const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

export const deliveryManAcceptOrder = async (req, res) => {
  try {
    const { orderId, productId } = req.body;
    const deliveryManId = req.deliveryManId;

    if (!orderId || !productId) {
      return res.status(400).json({
        success: false,
        message: "orderId and productId are required",
      });
    }


    const deliveryMan = await DeliveryMan.findById(deliveryManId);
    if (!deliveryMan || !deliveryMan.isVerifiedDelivery) {
      return res.status(403).json({
        success: false,
        message: "Only verified delivery men can accept orders",
      });
    }


    const order = await Order.findById(orderId).populate("items.product").populate("user");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }


    const item = order.items.find(
      (i) =>
        i.product._id.toString() === productId.toString() &&
        i.orderStatus === "Shipped"
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "This product is not shipped yet or already accepted by another delivery man",
      });
    }


    if (item.deliveryMan) {
      return res.status(400).json({
        success: false,
        message: "This order item has already been assigned to a delivery man",
      });
    }


    const otp = generateOTP();
    item.deliveryMan = deliveryMan._id;
    item.deliveryVerificationCode = otp;
    deliveryMan.status = "On Delivery";


    await order.save();


    deliveryMan.assignedOrders.push({
      orderId: order._id,
      itemId: item._id,
      assignedAt: new Date(),
    });
    await deliveryMan.save();



    if (order.user?.mobileNumber) {
      const message = `Your order #${order._id} item "${item.product.name}" is out for delivery. Use OTP ${otp} to confirm delivered to you.`;
      await sendMobileVerificationCode(order.user.mobileNumber, message);
    }

    if (order.user?.email) {
      await sendItemDeliveryOTPEmail(order.user.email, {
        userName: order.user.name,
        orderId: order._id,
        otpCode: otp,
        item: {
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        },
      });
    }




    res.status(200).json({
      success: true,
      message: "Order item accepted by delivery man and OTP sent to user",
      order,
    });
  } catch (error) {
    console.error("❌ Error accepting order by delivery man:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const getDeliveryManPendingOrders = async (req, res) => {
  try {
    const deliveryManId = req.userId;


    const deliveryMan = await DeliveryMan.findOne({ user: deliveryManId, isVerifiedDelivery: true });
    if (!deliveryMan) {
      return res.status(403).json({ success: false, message: "You are not a verified delivery man" });
    }


    const orders = await Order.find({
      "items.deliveryMan": deliveryMan._id,
      "items.orderStatus": "Shipped",
    }).populate("items.product", "name price images description attributes ingredients brand size discount")
      .populate("user", "name email mobileNumber");


    const filteredOrders = orders.map(order => {
      const items = order.items.filter(item => item.deliveryMan?.toString() === deliveryMan._id.toString() && item.orderStatus === "Shipped");
      return { ...order.toObject(), items };
    }).filter(order => order.items.length > 0);

    res.status(200).json({ success: true, orders: filteredOrders });
  } catch (error) {
    console.error("DeliveryMan Pending Orders Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const verifyDeliveryCodeAndMarkDelivered = async (req, res) => {
  try {
    const { orderId, productId, code } = req.body;

    if (!orderId || !productId || !code) {
      return res.status(400).json({
        success: false,
        message: "orderId, productId and code are required",
      });
    }

    const order = await Order.findById(orderId).populate("items.product", "name").populate("user");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const item = order.items.find(
      (i) => i.product._id.toString() === productId
    );

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in this order" });
    }


    if (item.deliveryMan.toString() !== req.deliveryManId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to deliver this item",
      });
    }

    if (item.orderStatus === "Delivered") {
      return res
        .status(400)
        .json({ success: false, message: "Item already delivered" });
    }

    if (item.deliveryVerificationCode !== code) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
    }


    item.orderStatus = "Delivered";
    const ordersWithDeliveryManItems = await Order.find({
      "items.deliveryMan": req.deliveryManId
    });


    const allItemsDelivered = ordersWithDeliveryManItems.every(o =>
      o.items
        .filter(i => i.deliveryMan?.toString() === req.deliveryManId.toString())
        .every(i => i.orderStatus === "Delivered")
    );

    if (allItemsDelivered) {

      await DeliveryMan.findByIdAndUpdate(req.deliveryManId, { status: "Available" });
    }
    item.deliveryVerificationCode = null;

    await order.save();


    if (order.user?.mobileNumber) {
      const message = `Your order #${order._id} item "${item.product.name}" has been successfully delivered.`;
      await sendMobileVerificationCode(order.user.mobileNumber, message);
    }

    res.status(200).json({
      success: true,
      message: "Item marked as delivered successfully",
      order,
    });
  } catch (error) {
    console.error("Verify Delivery Code Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


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

export const cancelOrderItems = async (req, res) => {
  try {
    const { orderId, productIds } = req.body;

    if (!orderId || !productIds?.length) {
      return res.status(400).json({
        success: false,
        message: "orderId and productIds[] are required",
      });
    }


    const order = await Order.findOne({ _id: orderId, user: req.userId })
      .populate("items.product", "name price images description stockQuantity")
      .populate("user", "name email mobileNumber");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }


    const cancellableItems = order.items.filter(
      (item) =>
        productIds.includes(item.product._id.toString()) &&
        ["Pending", "Processing"].includes(item.orderStatus)
    );

    if (!cancellableItems.length) {
      return res.status(400).json({
        success: false,
        message: "No eligible items to cancel (already shipped or invalid products)",
      });
    }


    for (const item of cancellableItems) {
      item.orderStatus = "Cancelled";


      if (item.product) {
        item.product.stockQuantity += item.quantity;
        await item.product.save();
      }
    }


    await order.save();


    const cancelledNames = cancellableItems
      .map((item) => item.product.name)
      .join(", ");


    const populatedOrder = await Order.findById(order._id)
      .populate("items.product", "name price images description stockQuantity")
      .populate("user", "name email mobileNumber")
      .exec();


    if (populatedOrder.user?.mobileNumber) {
      const message = `Your order #${populatedOrder._id} item(s) "${cancelledNames}" have been cancelled by you.`;
      await sendMobileVerificationCode(populatedOrder.user.mobileNumber, message);
    }

    res.status(200).json({
      success: true,
      message: "Selected items cancelled successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
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




export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, transactionId, code } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }


    let codeDiscountPercent = 0;
    if (code) {
      const spin = await Spin.findOne({ code, user: req.userId, used: false, expire: false });
      if (!spin) {
        return res.status(400).json({ success: false, message: "Invalid or expired coupon code" });
      }

      codeDiscountPercent = spin.value || 0;


      spin.used = true;
      await spin.save();
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

      const priceAfterProductDiscount = parseFloat(
        (product.price - (product.price * (product.discount || 0)) / 100).toFixed(2)
      );


      const finalDiscountPrice = parseFloat(
        (priceAfterProductDiscount - (priceAfterProductDiscount * codeDiscountPercent) / 100).toFixed(2)
      );


      orderItems.push({
        product: product._id,
        seller: product.seller || null,
        quantity: item.quantity,
        price: product.price,
        discount: product.discount || 0,
        couponDiscount: codeDiscountPercent,
        discountPrice: finalDiscountPrice,
        size: item.size || null,
        orderStatus: "Pending",
      });


      product.stockQuantity -= item.quantity;
      await product.save();
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


    if (req.userPhone) {
      const message = `Your order #${order._id} has been placed successfully!`;
      await sendMobileVerificationCode(req.userPhone, message);
    }
    if (req.userEmail) {
      const firstItem = orderItems[0];
      await sendOrderStatusUpdateEmail(req.userEmail, {
        orderId: order._id,
        orderStatus: "Placed",
        productName: firstItem?.product?.name || "Your items",
        quantity: orderItems.reduce((sum, i) => sum + i.quantity, 0),
      });
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
      appliedCode: code || null,
      codeDiscountPercent,
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


    const order = await Order.findById(req.params.orderId)
      .populate("items.product")
      .populate("user").populate("items.seller");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });


    const item = order.items.find(
      (i) => i.product._id.toString() === productId.toString()
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "This product is not part of the order",
      });
    }


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


    item.orderStatus = "Processing";
    item.seller = req.sellerId;
    await order.save();


    if (order.user?.mobileNumber) {
      const message = `Your order #${order._id} item "${item.product.name}" has been accepted by ${seller.shopName} and is now processing.`;
      await sendMobileVerificationCode(order.user.mobileNumber, message);
    }
    if (order.user?.email) {
      await sendOrderStatusUpdateEmail(order.user.email, {
        orderId: order._id,
        sellerName: item.seller?.shopName,
        orderStatus: "Processing",
        productName: item.product.name,
        quantity: item.quantity,
      });
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

export const getAdminAnalytics = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


    const monthlySales = await Order.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          "items.orderStatus": { $ne: "Cancelled" },
          createdAt: { $gte: new Date(`${currentYear}-01-01`), $lte: new Date(`${currentYear}-12-31`) },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalRevenue: { $sum: { $multiply: ["$items.discountPrice", "$items.quantity"] } },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
      {
        $project: {
          _id: 1,
          totalRevenue: { $round: ["$totalRevenue", 2] },
          orderCount: 1,
        },
      },
    ]);

    const monthlyData = MONTH_NAMES.map((month, index) => {
      const found = monthlySales.find((m) => m._id.month === index + 1);
      const totalRevenue = found ? found.totalRevenue : 0;
      return {
        month,
        revenue: totalRevenue,
        adminRevenue: +(totalRevenue * 0.2).toFixed(2),
        sellerRevenue: +(totalRevenue * 0.8).toFixed(2),
        orders: found ? found.orderCount : 0,
      };
    });


    const orderStatus = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);


    const revenueBySeller = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.seller": { $ne: null }, "items.orderStatus": { $ne: "Cancelled" } } },
      {
        $group: {
          _id: "$items.seller",
          totalRevenue: { $sum: { $multiply: ["$items.discountPrice", "$items.quantity"] } },
          perItem: { $push: { product: "$items.product", revenue: { $multiply: ["$items.discountPrice", "$items.quantity"] } } },
        },
      },
      {
        $lookup: {
          from: "sellers",
          localField: "_id",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: "$seller" },
      {
        $project: {
          sellerName: "$seller.shopName",
          totalRevenue: { $round: ["$totalRevenue", 2] },
          sellerRevenue: { $round: [{ $multiply: ["$totalRevenue", 0.8] }, 2] },
          adminRevenue: { $round: [{ $multiply: ["$totalRevenue", 0.2] }, 2] },
          perItemRevenue: {
            $map: {
              input: "$perItem",
              as: "item",
              in: {
                product: "$$item.product",
                revenue: { $round: ["$$item.revenue", 2] },
                adminRevenue: { $round: [{ $multiply: ["$$item.revenue", 0.2] }, 2] },
                sellerRevenue: { $round: [{ $multiply: ["$$item.revenue", 0.8] }, 2] },
              },
            },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);


    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.orderStatus": { $ne: "Cancelled" } } },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.discountPrice", "$items.quantity"] } },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $sort: { totalSold: -1 } },
      { $limit: 4 },
      {
        $project: {
          productName: "$product.name",
          totalSold: 1,
          totalRevenue: { $round: ["$totalRevenue", 2] },
          adminShare: { $round: [{ $multiply: ["$totalRevenue", 0.2] }, 2] },
          sellerShare: { $round: [{ $multiply: ["$totalRevenue", 0.8] }, 2] },
        },
      },
    ]);


    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const dailyOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" } },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: { $multiply: ["$items.discountPrice", "$items.quantity"] } },
        },
      },
      {
        $addFields: {
          adminRevenue: { $round: [{ $multiply: ["$totalRevenue", 0.2] }, 2] },
          sellerRevenue: { $round: [{ $multiply: ["$totalRevenue", 0.8] }, 2] },
          totalRevenue: { $round: ["$totalRevenue", 2] },
        },
      },
      { $sort: { "_id.month": 1, "_id.day": 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: { monthlyData, orderStatus, revenueBySeller, topProducts, dailyOrders },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
export const sellerShipOrder = async (req, res) => {
  try {
    const { productId } = req.body;


    const seller = await Seller.findById(req.sellerId);
    if (!seller)
      return res.status(404).json({ success: false, message: "Seller not found" });

    if (!seller.isVerifiedSeller) {
      return res.status(403).json({
        success: false,
        message: "Only verified sellers can update orders",
      });
    }


    const order = await Order.findById(req.params.orderId)
      .populate("items.product")
      .populate("user").populate("items.seller");

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });


    const item = order.items.find(
      (i) => i.product._id.toString() === productId.toString()
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "This product is not part of the order",
      });
    }


    if (item.orderStatus !== "Processing") {
      return res.status(400).json({
        success: false,
        message: `This item cannot be shipped because its current status is "${item.orderStatus}"`,
      });
    }


    item.orderStatus = "Shipped";
    await order.save();


    seller.shippedOrders.push({
      orderId: order._id,
      itemId: item._id,
      product: {
        _id: item.product._id,
        name: item.product.name,
        price: item.price,
        discount: item.discount,
        discountPrice: item.discountPrice,
        images: item.product.images,
      },
      quantity: item.quantity,
    });
    seller.totalSales += 1
    await seller.save();


    if (order.user?.mobileNumber) {
      const message = `Your order #${order._id} item "${item.product.name}" has been shipped by ${seller.shopName} and is on its way.`;
      await sendMobileVerificationCode(order.user.mobileNumber, message);
    }
    if (order.user?.email) {
      await sendOrderStatusUpdateEmail(order.user.email, {
        orderId: order._id,
        orderStatus: "Shipped",
        sellerName: item.seller?.shopName,
        productName: item.product.name,
        quantity: item.quantity,
      });
    }
    res.status(200).json({
      success: true,
      message: "Item marked as Shipped and stored in seller's shippedOrders",
      order,
      shippedItem: seller.shippedOrders[seller.shippedOrders.length - 1],
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


export const getUnassignedShippedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "items.deliveryMan": null })
      .populate("items.product"
      )
      .populate("user", "name email mobileNumber")
      .sort({ createdAt: -1 });

    const filteredOrders = [];

    for (const order of orders) {
      const matchedItems = [];

      for (const item of order.items) {
        if (!item.product) continue;


        if (item.orderStatus === "Shipped" && !item.deliveryMan) {
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
    console.error("❌ Error fetching unassigned shipped orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrderforAdmin = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price images category")
      .populate("items.seller", "name email shopName")
      .populate("items.deliveryMan", "name vehicleNumber phone")
      .lean();


    const orderItems = [];

    orders.forEach((order) => {
      order.items.forEach((item) => {
        orderItems.push({
          orderId: order._id,
          user: order.user,
          product: item.product,
          seller: item.seller,
          deliveryMan: item.deliveryMan,
          quantity: item.quantity,
          price: item.price,
          orderStatus: item.orderStatus,
          discountPrice: item.discountPrice,
          orderStatus: item.orderStatus,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          shippingAddress: order.shippingAddress,
          createdAt: order.createdAt,
        });
      });
    });

    res.status(200).json({ success: true, count: orderItems.length, orderItems });
  } catch (error) {
    console.error("Error fetching order items:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
}


export const exportOrdersToExcel = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name")
      .populate("items.seller", "shopName")
      .populate("items.deliveryMan", "name vehicleNumber");


    const data = [];
    orders.forEach((order) => {
      order.items.forEach((item) => {
        data.push({
          OrderID: order._id.toString(),
          User: order.user?.name || "Unknown",
          Email: order.user?.email || "Unknown",
          Product: item.product?.name || "Unknown",
          Seller: item.seller?.shopName || "Not Accepted",
          Delivery: item.deliveryMan?.vehicleNumber || "Not Assigned",
          Quantity: item.quantity,
          Price: item.price,
          DiscountPrice: item.discountPrice,
          Status: item.orderStatus,
          CreatedAt: order.createdAt.toISOString(),
          UpdatedAt: order.updatedAt.toISOString(),
        });
      });
    });


    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");


    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });


    res.setHeader(
      "Content-Disposition",
      "attachment; filename=orders.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to export orders" });
  }
};