
import Seller from "../models/seller.model.js";
import User from "../models/auth.model.js";
import ExcelJS from "exceljs";



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


export const updateSeller = async (req, res) => {
  try {
    const userId = req.userId;

    const seller = await Seller.findOne({ user: userId });
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller profile not found" });
    }

    const { shopName, shopDescription, categories, contactEmail, contactPhone, accountInfo, logo } = req.body;


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


    const seller = await Seller.findById(sellerId).populate("user");
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }


    seller.isVerifiedSeller = true;
    await seller.save();


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


export const getUnverifiedSellers = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDir = req.query.sort === "asc" ? 1 : -1;


    const sellers = await Seller.find({ isVerifiedSeller: false })
      .populate("user", "-password")
      .populate("categories")
      .populate("products")
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
      .populate("user", "name email mobileNumber address isVerified")
      .populate("categories", "name")
      .populate("products", "name price");

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


    const sellers = await Seller.find({ isVerifiedSeller: true })
      .populate("user", "-password")
      .populate("categories")
      .populate("products")
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

export const exportSellersToExcel = async (req, res) => {
  try {

    const sellers = await Seller.find()
      .populate("user", "name email")
      .populate("categories", "name");


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sellers");


    worksheet.columns = [
      { header: "Seller ID", key: "_id", width: 25 },
      { header: "User Name", key: "userName", width: 25 },
      { header: "User Email", key: "userEmail", width: 30 },
      { header: "Shop Name", key: "shopName", width: 30 },
      { header: "Verified Seller", key: "isVerifiedSeller", width: 15 },
      { header: "Contact Email", key: "contactEmail", width: 25 },
      { header: "Contact Phone", key: "contactPhone", width: 20 },
      { header: "Total Sales", key: "totalSales", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 },
    ];


    sellers.forEach((s) => {
      worksheet.addRow({
        _id: s._id.toString(),
        userName: s.user?.name || "—",
        userEmail: s.user?.email || "—",
        shopName: s.shopName,
        isVerifiedSeller: s.isVerifiedSeller ? "Yes" : "No",
        contactEmail: s.contactEmail,
        contactPhone: s.contactPhone,
        totalSales: s.totalSales,
       
        createdAt: s.createdAt.toLocaleString(),
      });
    });


    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=sellers.xlsx`
    );


    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to export sellers", error: err.message });
  }
};


export const deleteSellerByAdmin = async (req, res) => {
  try {
    const { id } = req.params;


    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }


    await User.findByIdAndUpdate(seller.user, {
      seller: null,
      isSeller: false,
      isSellerVerification: false
    });


    await Seller.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Seller deleted successfully" });
  } catch (error) {
    console.error("Delete Seller Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


