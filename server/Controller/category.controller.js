import Category from "../models/category.model.js";



export const createCategory = async (req, res) => {
  try {
    const { name, description, parentCategory } = req.body;
    const image = req.body.image || null;

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: "Category with this name already exists" });
    }

    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(400).json({ success: false, message: "Invalid parent category ID" });
      }
    }

    const category = new Category({
      name: name.trim(),
      description,
      parentCategory: parentCategory || null,
      image,
    });

    const savedCategory = await category.save();
    res.status(201).json({ success: true, message: "Category created successfully", data: savedCategory });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}


export const updateCategory = async (req, res) => {
  try {
    let { parentCategory, image, ...rest } = req.body;
    const updateData = { ...rest };


    if (parentCategory === null || parentCategory === "" || parentCategory === undefined) {
      updateData.parentCategory = null;
    } else {

      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(400).json({ success: false, message: "Invalid parent category ID" });
      }
      updateData.parentCategory = parentCategory;
    }

    if (image) updateData.image = image;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("parentCategory", "name");

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, message: "Category updated successfully", data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const getAllCategories = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDir = req.query.sort === 'asc' ? 1 : -1;
    const categories = await Category.find().populate("parentCategory", "name").sort({ createdAt: sortDir }).skip(startIndex).limit(limit);
    if (categories.length === 0) {
      return res.status(404).json({ success: false, message: "No categories found" });
    }
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const searchCategory = async (req, res) => {
  try {
    const { value } = req.params;


    let query = {
      $or: [
        { name: new RegExp(value, "i") },
        { description: new RegExp(value, "i") }
      ]
    };


    if (/^[0-9a-fA-F]{24}$/.test(value)) {
      query.$or.push({ parentCategory: value });
    }


    const categories = await Category.find(query).populate("parentCategory");

    if (!categories.length) {
      return res.status(404).json({ message: "No categories found" });
    }
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("parentCategory", "name");
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid category ID format" });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid category ID format" });
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getCategories = async (req, res, next) => {
 
  try {


    const totalCategories = await Category.countDocuments();
    const now = new Date();
    const oneMonthAgoDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    )
    const lastMonthsCategory = await Category.countDocuments({ createdAt: { $gte: oneMonthAgoDate } });

    return res.status(200).json({ totalCategories, lastMonthsCategory, success: true });

  }
  catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
}

export const getRootCategories = async (req, res) => {
  try {
    const categories = await Category.find({ parentCategory: null });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Error fetching root categories:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
    });
  }
};