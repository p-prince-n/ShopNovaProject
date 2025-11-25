import User from "../models/auth.model.js";
import ExcelJS from "exceljs";
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
    const { id } = req.params;
    const loggedInUser = await User.findById(req.userId);
    const targetUser = await User.findById(id);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }


    if (loggedInUser._id.toString() === targetUser._id.toString()) {
      await User.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "Your account has been deleted",
      });
    }


    if (loggedInUser.isAdmin) {

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

export const exportUsersToExcel = async (req, res) => {
  try {
    const users = await User.find().lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");


    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Mobile", key: "mobileNumber", width: 15 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Is Admin", key: "isAdmin", width: 10 },
      { header: "Is Seller", key: "isSeller", width: 10 },
      { header: "Is DeliveryMan", key: "isDeliveryMan", width: 15 },
      { header: "Last Login", key: "lastLogin", width: 20 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Updated At", key: "updatedAt", width: 20 },
    ];


    users.forEach((user) => {
      worksheet.addRow({
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        gender: user.gender,
        isAdmin: user.isAdmin,
        isSeller: user.isSeller,
        isDeliveryMan: user.isDeliveryMan,
        lastLogin: user.lastLogin ? user.lastLogin.toISOString() : "",
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });
    });


    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users.xlsx"
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to export users." });
  }
};
