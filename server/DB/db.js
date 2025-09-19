import mongoose from "mongoose";

export const connectDB=async () => {
    try{
        const DB_URI=process.env.DB_URI
    const conn=await mongoose.connect(DB_URI);
    console.log(`connnect to ${conn.connection.host}`);
    }catch(e){
        console.log('error : '+ e);
        process.exit(1);
        
    }
    
}