import Spin from "../models/spin.model.js";


const expireOldSpins = async () => {
  await Spin.updateMany(
    { createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, expire: false },
    { $set: { expire: true } }
  );
};




export const createSpin = async (req, res) => {
  try {
    const userId = req.userId;


    await expireOldSpins();


    const existingSpin = await Spin.findOne({ user: userId, expire: false, used: false });
    if (existingSpin) {
      return res
        .status(400)
        .json({ message: "You can only create one spin every 24 hours." });
    }

    const { value } = req.body;
    if (!value) {
      return res.status(400).json({ message: "Spin value is required." });
    }

    const newSpin = await Spin.create({
      value,
      user: userId,
    });

    res.status(201).json({ message: "Spin created successfully", spin: newSpin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getUserSpins = async (req, res) => {
  try {
    const userId = req.userId;

    await expireOldSpins();

    const spins = await Spin.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(spins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const deleteSpin = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const spin = await Spin.findOne({ _id: id, user: userId });
    if (!spin) {
      return res.status(404).json({ message: "Spin not found" });
    }

    await spin.deleteOne();

    res.status(200).json({ message: "Spin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getNextSpinTime = async (req, res) => {
  try {
    const userId = req.userId;

    const lastSpin = await Spin.findOne({ user: userId, expire: false }).sort({
      createdAt: -1,
    });

    if (!lastSpin) {
      return res.status(200).json({ nextSpinAvailable: true, nextSpinTime: null });
    }

    const spinTime = lastSpin.createdAt.getTime();
    const nextAvailableTime = spinTime + 24 * 60 * 60 * 1000;

    const now = Date.now();
    if (now >= nextAvailableTime) {
      return res.status(200).json({ nextSpinAvailable: true, nextSpinTime: null });
    } else {
      return res.status(200).json({
        nextSpinAvailable: false,
        nextSpinTime: new Date(nextAvailableTime),
        remainingMs: nextAvailableTime - now,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const verifySpinCode = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.userId;

    if (!code) {
      return res.status(400).json({ message: "Spin code is required." });
    }

    await expireOldSpins();

    const spin = await Spin.findOne({ code, user: userId });

    if (!spin) {
      return res.status(404).json({ message: "Invalid coupon code." });
    }

    if (spin.expire) {
      return res.status(400).json({ message: "Coupon code has expired." });
    }

    if (spin.used) {
      return res.status(400).json({ message: "Coupon code already used." });
    }


    await spin.save();

    return res.status(200).json({
      message: `You get ${spin.value}% discount 🎉`,
      value: spin.value,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
