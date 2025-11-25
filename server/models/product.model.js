import mongoose from "mongoose";

const WEATHER_TYPES = ["Clear", "Clouds", "Rain", "Snow", "Drizzle", "Thunderstorm", "Mist", "Fog", "Haze"];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }],
    size: { type: [String], default: [] },
    material: { type: String, trim: true },
    expiryDate: { type: Date },
    isPerishable: { type: Boolean, default: false },
    ingredients: { type: [String], default: [] },
    brand: { type: String, trim: true },

    ratings: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0 },
    userRatings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true, min: 0, max: 5 }
      }
    ],

    attributes: { type: mongoose.Schema.Types.Mixed },


    famousInCities: { type: [String], default: [] },

    weatherTags: [{
      type: String,
      enum: WEATHER_TYPES,
      required: true
    }]
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
