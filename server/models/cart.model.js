import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    price: {
        type: Number,
        required: true, // snapshot of product price
    },
    discount: {
        type: Number,
        default: 0, // comes from product.discount
    },
    discountPrice: {
        type: Number,
        required: true, // auto-calculated (price - discount)
    },
    size: {
        type: String,   // only one size allowed
    }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // one cart per user
    },
    items: [cartItemSchema],
    totalPrice: {
        type: Number,
        default: 0,
    },
    totalItems: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

// auto update totals
cartSchema.pre("save", async function (next) {
    const Product = mongoose.model("Product");

    for (let item of this.items) {
        const productDoc = await Product.findById(item.product).select("price discount");

        if (productDoc) {
            item.price = productDoc.price;
            item.discount = productDoc.discount;
            item.discountPrice = productDoc.price - (productDoc.price * productDoc.discount / 100);
        }
    }

    this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.totalPrice = this.items.reduce((sum, item) => sum + item.discountPrice * item.quantity, 0);

    next();
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
