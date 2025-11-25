import DeliveryMan from "../models/delivery.model.js";
import User from "../models/auth.model.js";


export const createDeliveryMan = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      vehicleNumber,
      drivingLicense,
      contactEmail,
      contactPhone,
      accountInfo,
    } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.isDeliveryMan) {
      return res.status(403).json({ success: false, message: "User is not marked as a delivery man" });
    }

    const existingDelivery = await DeliveryMan.findOne({ user: userId });
    if (existingDelivery) {
      return res.status(400).json({ success: false, message: "Delivery man profile already exists" });
    }

    const newDeliveryMan = new DeliveryMan({
      user: userId,
      vehicleNumber,
      drivingLicense,
      contactEmail,
      contactPhone,
      accountInfo,
    });

    await newDeliveryMan.save();


    user.delivery = newDeliveryMan._id;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Delivery man profile created successfully",
      deliveryMan: newDeliveryMan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating delivery man profile",
      error: error.message,
    });
  }
};


export const updateDeliveryMan = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      vehicleNumber,
      drivingLicense,
      contactEmail,
      contactPhone,
      accountInfo,
      status,
    } = req.body;

    const deliveryMan = await DeliveryMan.findOne({ user: userId });
    if (!deliveryMan) {
      return res.status(404).json({ success: false, message: "Delivery man profile not found" });
    }

    if (vehicleNumber) deliveryMan.vehicleNumber = vehicleNumber;
    if (drivingLicense) deliveryMan.drivingLicense = drivingLicense;
    if (contactEmail) deliveryMan.contactEmail = contactEmail;
    if (contactPhone) deliveryMan.contactPhone = contactPhone;
    if (accountInfo) deliveryMan.accountInfo = { ...deliveryMan.accountInfo, ...accountInfo };
    if (status) deliveryMan.status = status;

    await deliveryMan.save();

    res.status(200).json({
      success: true,
      message: "Delivery man profile updated successfully",
      deliveryMan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating delivery man profile",
      error: error.message,
    });
  }
};


export const verifyDeliveryMan = async (req, res) => {
  try {
    const { deliveryManId } = req.params;

    const deliveryMan = await DeliveryMan.findById(deliveryManId).populate("user");
    if (!deliveryMan) {
      return res.status(404).json({ success: false, message: "Delivery man not found" });
    }

    deliveryMan.isVerifiedDelivery = true;
    await deliveryMan.save();


    if (deliveryMan.user && !deliveryMan.user.isDeliveryManVerification) {
      deliveryMan.user.isDeliveryManVerification = true;
      await deliveryMan.user.save();
    }

    res.status(200).json({
      success: true,
      message: "Delivery man verified successfully",
      deliveryMan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying delivery man",
      error: error.message,
    });
  }
};


export const getUnverifiedDeliveryMen = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDir = req.query.sort === "asc" ? 1 : -1;

    const deliveryMen = await DeliveryMan.find({ isVerifiedDelivery: false })
      .populate("user", "-password")
      .sort({ createdAt: sortDir })
      .skip(startIndex)
      .limit(limit);

    const totalDeliveryMen = await DeliveryMan.countDocuments({ isVerifiedDelivery: false });

    const now = new Date();
    const oneMonthAgoDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthDeliveryMen = await DeliveryMan.countDocuments({
      isVerifiedDelivery: false,
      createdAt: { $gte: oneMonthAgoDate },
    });

    res.status(200).json({
      data: deliveryMen,
      totalDeliveryMen,
      lastMonthDeliveryMen,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const getVerifiedDeliveryMen = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDir = req.query.sort === "asc" ? 1 : -1;

    const deliveryMen = await DeliveryMan.find({ isVerifiedDelivery: true })
      .populate("user", "-password")
      .sort({ createdAt: sortDir })
      .skip(startIndex)
      .limit(limit);

    const totalDeliveryMen = await DeliveryMan.countDocuments({ isVerifiedDelivery: true });

    const now = new Date();
    const oneMonthAgoDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthDeliveryMen = await DeliveryMan.countDocuments({
      isVerifiedDelivery: true,
      createdAt: { $gte: oneMonthAgoDate },
    });

    res.status(200).json({
      data: deliveryMen,
      totalDeliveryMen,
      lastMonthDeliveryMen,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const getDeliveryManProfile = async (req, res) => {
  try {
    const deliveryMan = await DeliveryMan.findOne({ user: req.userId })
      .populate("user", "name email mobileNumber isDeliveryManVerification");

    if (!deliveryMan) {
      return res.status(404).json({ success: false, message: "Delivery man profile not found" });
    }

    res.status(200).json({ success: true, deliveryMan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteDeliveryManByAdmin = async (req, res) => {
  try {
    const { id } = req.params;


    const deliveryMan = await DeliveryMan.findById(id);
    if (!deliveryMan) {
      return res.status(404).json({ success: false, message: "Delivery man not found" });
    }


    await User.findByIdAndUpdate(deliveryMan.user, {
      delivery: null,
      isDeliveryMan: false,
      isDeliveryManVerification: false
    });


    await DeliveryMan.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Delivery man deleted successfully" });
  } catch (error) {
    console.error("Delete DeliveryMan Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};