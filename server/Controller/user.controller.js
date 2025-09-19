import User from "../models/auth.model.js";
import mongoose from "mongoose";
export const getUsers=async(req, res, next)=>{
    try{
        const startIndex=parseInt(req.query.startIndex) || 0;
        const limit=parseInt(req.query.limit) || 9;
        const sortDir = req.query.sort === 'asc' ? 1 : -1;
        const users= await User.find().sort({createdAt: sortDir}).skip(startIndex).limit(limit);
      

        const usersWithoutPass=users.map((user)=>{
            const {password, ...rest}=user._doc;
            return rest;
        });
        const totalUsers= await User.countDocuments();
        const now =new Date();
        const oneMonthAgoDate=new Date(
            now.getFullYear(),
            now.getMonth() -1 ,
            now.getDate(),
        )
        const lastMonthsUser=await User.countDocuments({createdAt: {$gte: oneMonthAgoDate}});

        return res.status(200).json({data: usersWithoutPass, totalUsers, lastMonthsUser,  success: true });

    }
    catch(e){
        res.status(400).json({success: false, message: e.message});
    }
}



export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // user to delete
    const loggedInUser = await User.findById(req.userId); // requester
    const targetUser = await User.findById(id); // target

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Case 1: user deletes own account
    if (loggedInUser._id.toString() === targetUser._id.toString()) {
      await User.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "Your account has been deleted",
      });
    }

    // Case 2: admin deletes another user
    if (loggedInUser.isAdmin) {
      // Admin cannot delete another admin
      if (targetUser.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Admins cannot delete other admins",
        });
      }

      await User.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "User deleted successfully by admin",
      });
    }

    // Otherwise → not allowed
    return res.status(403).json({
      success: false,
      message: "You are not allowed to delete this user",
    });
  } catch (error) {
    console.error("Delete User Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    });
  }
};

