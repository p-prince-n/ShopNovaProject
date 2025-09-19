import { GoogleGenAI } from '@google/genai';
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"];
const weatherTypes = ["Clear", "Clouds", "Rain", "Snow", "Drizzle", "Thunderstorm", "Mist", "Fog", "Haze"];

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
      - Cities: ${cities.join(", ")}
      - Weather: ${weatherTypes.join(", ")}

      Respond with a JSON object. If a filter is not found, use null.
      {
        "keywords": [array of main product keywords],
        "category": "one of the available categories or null",
        "minPrice": number or null,
        "maxPrice": number or null,
        "city": "one of the available cities or null",
        "weather": "one of the available weather types or null"
      }
    `;

    // Generate content from Gemini AI
    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
    });
    
    const generatedText = result.text;

    let filters;
    try {
      const jsonMatch = generatedText.match(/{.*}/s);
      filters = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      filters = {};
    }

    const query = {};
    if (filters.category) {
      const cat = categories.find(c => c.name.toLowerCase() === filters.category.toLowerCase());
      if (cat) query.categories = { $in: [cat._id] };
    }
    if (filters.keywords?.length) query.name = { $regex: filters.keywords.join("|"), $options: "i" };
    if (filters.minPrice) query.price = { ...query.price, $gte: filters.minPrice };
    if (filters.maxPrice) query.price = { ...query.price, $lte: filters.maxPrice };
    if (filters.city) query.famousInCities = filters.city;
    if (filters.weather) query.weatherTags = filters.weather;

    const products = await Product.find(query).limit(10);

    if (!products.length) {
      const popularProducts = await Product.find({}).sort({ ratings: -1 }).limit(5);
      return res.json({
        success: true,
        message: "No matches found. Here are some popular items.",
        totalMatches: 0,
        products: popularProducts.map(p => ({
          name: p.name,
          url: `http://localhost:5173/productdetail/${p._id}`
        }))
      });
    }

    res.json({
      success: true,
      message: `I found ${products.length} products matching your query!`,
      totalMatches: products.length,
      products: products.map(p => ({
        name: p.name,
        url: `http://localhost:5173/productdetail/${p._id}`
      }))
    });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ success: false, message: "Error processing request." });
  }
};
