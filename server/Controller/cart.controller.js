import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }


    if (product.size.length > 0 && !size) {
      return res.status(400).json({ success: false, message: "Size is required for this product" });
    }

    if (product.stockQuantity < quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock available" });
    }

    const discountPrice = product.price - (product.price * product.discount / 100);

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }


    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (existingItem) {
      if (product.stockQuantity < existingItem.quantity + quantity) {
        return res.status(400).json({ success: false, message: "Not enough stock available" });
      }

    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        discount: product.discount,
        discountPrice,
        size: size || null,
      });
    }





    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.product",
        select: "name price discount images stockQuantity ratings description size",
      })
      .lean();


    let totalItems = 0;
    let totalPrice = 0;
    populatedCart.items.forEach((item) => {
      totalItems += item.quantity;
      const discountPrice =
        item.product.price - (item.product.price * item.product.discount) / 100;
      totalPrice += discountPrice * item.quantity;
    });

    populatedCart.totalItems = totalItems;
    populatedCart.totalPrice = totalPrice;

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message,
    });
  }
};



export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate("items.product");
    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [], totalPrice: 0, totalItems: 0 } });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching cart", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }


    if (product.size.length > 0 && !size) {
      return res.status(400).json({ success: false, message: "Size is required for this product" });
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId && item.size === (size || null)
    );

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }


    const difference = quantity - item.quantity;

    if (difference > 0) {
      if (product.stockQuantity < difference) {
        return res.status(400).json({ success: false, message: "Not enough stock available" });
      }
      item.quantity = quantity;

    } else if (difference < 0) {
      item.quantity = quantity;

    }


    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.product",
        select: "name price discount images stockQuantity ratings description size",
      })
      .lean();


    let totalItems = 0;
    let totalPrice = 0;
    populatedCart.items.forEach((item) => {
      totalItems += item.quantity;
      const discountPrice =
        item.product.price - (item.product.price * item.product.discount) / 100;
      totalPrice += discountPrice * item.quantity;
    });

    populatedCart.totalItems = totalItems;
    populatedCart.totalPrice = totalPrice;

    res.status(200).json({
      success: true,
      message: "Quantity updated",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating quantity",
      error: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId, size } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }


    if (product.size.length > 0 && !size) {
      return res
        .status(400)
        .json({ success: false, message: "Size is required for this product" });
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }


    const itemToRemove = cart.items.find((item) => {
      if (product.size.length > 0) {
        return item.product.toString() === productId && item.size === size;
      }
      return item.product.toString() === productId;
    });

    if (!itemToRemove) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }






    cart.items = cart.items.filter((item) => {
      if (product.size.length > 0) {
        return !(item.product.toString() === productId && item.size === size);
      }
      return item.product.toString() !== productId;
    });

    await cart.save();


    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.product",
        select: "name price discount images stockQuantity ratings description size",
      })
      .lean();


    let totalItems = 0;
    let totalPrice = 0;
    populatedCart.items.forEach((item) => {
      totalItems += item.quantity;
      const discountPrice =
        item.product.price -
        (item.product.price * item.product.discount) / 100;
      totalPrice += discountPrice * item.quantity;
    });

    populatedCart.totalItems = totalItems;
    populatedCart.totalPrice = totalPrice;

    res
      .status(200)
      .json({
        success: true,
        message: "Item removed from cart",
        cart: populatedCart,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing item",
      error: error.message,
    });
  }
};


export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });


    for (let item of cart.items) {
      const product = await Product.findById(item.product);
      if (product) {

        await product.save();
      }
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;

    await cart.save();
    res.status(200).json({ success: true, message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error clearing cart", error: error.message });
  }
};

export const removeMultipleFromCart = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided" });
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    for (const { productId, size } of items) {
      const product = await Product.findById(productId);
      if (!product) continue;


      const itemIndex = cart.items.findIndex((item) => {
        if (product.size.length > 0) {
          return item.product.toString() === productId && item.size === size;
        }
        return item.product.toString() === productId;
      });

      if (itemIndex > -1) {






        cart.items.splice(itemIndex, 1);
      }
    }

    await cart.save();


    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.product",
        select: "name price discount images stockQuantity ratings description size",
      })
      .lean();


    populatedCart.totalItems = populatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
    populatedCart.totalPrice = populatedCart.items.reduce(
      (sum, item) => sum + item.discountPrice * item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      message: "Selected items removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing multiple items",
      error: error.message,
    });
  }
};
