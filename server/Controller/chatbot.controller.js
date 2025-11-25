import { GoogleGenAI } from '@google/genai';
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


const keywordCategoryMap = {
  mobile: ["Mobile & Tablets"],
  tablet: ["Mobile & Tablets"],
  electronics: ["Electronics"],
  fashion: ["Fashion"],
  grocery: ["Grocery"],
  food: ["Food"],
  furniture: ["Furniture"]
};

export const productAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required." });

    const categories = await Category.find({});
    const categoryNames = categories.map(c => c.name);

    const prompt = `
      Analyze the user query to identify product search filters.
      User Query: "${message}"

      Valid values:
      - Categories: ${categoryNames.join(", ")}
      - Discount: percentage number (0-100)
      - Price: number

      Respond with a JSON object. If a filter is not found, use null.
      {
        "keywords": [array of main product keywords],
        "category": "one of the available categories or null",
        "minPrice": number or null,
        "maxPrice": number or null,
        "discountMin": number or null,
        "discountMax": number or null,
        "city": "one of the available cities or null"
      }
    `;


    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });

    const generatedText = result.text;


    let filters = {};
    try {
      const cleaned = generatedText.replace(/```json|```/g, "").trim();
      filters = JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse AI response:", err);
      filters = {};
    }


    let query = { stockQuantity: { $gt: 0 } };
    const keywords = filters.keywords || [];
    const isGenericKeyword = keywords.some(k => ["product", "products"].includes(k.toLowerCase()));


    let categoriesToMatch = [];
    keywords.forEach(k => {
      const mapped = keywordCategoryMap[k.toLowerCase()];
      if (mapped) categoriesToMatch.push(...mapped);
    });
    if (filters.category) categoriesToMatch.push(filters.category);

    if (categoriesToMatch.length > 0) {
      const catIds = categories.filter(c => categoriesToMatch.includes(c.name)).map(c => c._id);
      query.categories = { $in: catIds };
    }


    if (!isGenericKeyword && keywords.length) {
      query.name = { $regex: keywords.join("|"), $options: "i" };
    }


    if (filters.minPrice != null || filters.maxPrice != null) {
      query.price = {};
      if (filters.minPrice != null) query.price.$gte = filters.minPrice;
      if (filters.maxPrice != null) query.price.$lte = filters.maxPrice;
    }


    if (filters.discountMin != null || filters.discountMax != null) {
      query.discount = {};
      if (filters.discountMin != null) query.discount.$gte = filters.discountMin;
      if (filters.discountMax != null) query.discount.$lte = filters.discountMax;
    }


    if (filters.city) query.famousInCities = filters.city;

    console.log("Applied filters:", filters);


    let products = await Product.find(query)
      .limit(50)
      .populate("categories", "name");


    if (products.length === 0) {
      const topDiscountProducts = await Product.find({ stockQuantity: { $gt: 0 } })
        .sort({ discount: -1 })
        .limit(10)
        .populate("categories", "name");

      return res.json({
        success: true,
        message: "No products found matching your query. Here are top 10 products with highest discounts.",
        totalMatches: 0,
        products: topDiscountProducts.map(p => ({
          name: p.name,
          price: p.price,
          discount: p.discount,
          url: `http://localhost:5173/productdetail/${p._id}`,
          categories: p.categories.map(c => c.name),
          stockQuantity: p.stockQuantity,
          famousInCities: p.famousInCities,
          size: p.size,
          material: p.material,
          brand: p.brand,
          ingredients: p.ingredients,
        })),
      });
    }


    res.json({
      success: true,
      message: `Found ${products.length} products matching your query.`,
      totalMatches: products.length,
      products: products.map(p => ({
        name: p.name,
        price: p.price,
        discount: p.discount,
        url: `http://localhost:5173/productdetail/${p._id}`,
        categories: p.categories.map(c => c.name),
        stockQuantity: p.stockQuantity,
        famousInCities: p.famousInCities,
        size: p.size,
        material: p.material,
        brand: p.brand,
        ingredients: p.ingredients,
      })),
    });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ success: false, message: "Error processing request." });
  }
};
