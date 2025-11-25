import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { connectDB } from './DB/db.js';
import authRouter from './routes/auth.route.js';
import cors from 'cors'
import productRouter from './routes/product.route.js';
import categoryRouter from './routes/category.route.js';
import userRouter from './routes/user.route.js';
import sellerRouter from './routes/seller.route.js';
import cartRouter from './routes/cart.route.js';
import reviewRouter from './routes/review.route.js';
import orderRouter from './routes/order.route.js';
import chatBotRouter from './routes/cahtbot.route.js';
import recommendationsRouter from './routes/recommendation.routes.js';
import spinRouter from './routes/spin.routes.js';
import deliveryManRouter from './routes/deliveryMan.route.js';


const app= express();
dotenv.config();
app.use(express.json());
app.use(cors({
    origin: 'https://shopnovaproject-2.onrender.com',
    methods:['GET','PUT','POST','DELETE', 'PATCH'],
    credentials: true,
}))
app.use(cookieParser());

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/product', productRouter);
app.use('/category', categoryRouter)
app.use('/sellers', sellerRouter)
app.use('/cart', cartRouter)
app.use('/review', reviewRouter)
app.use('/orders', orderRouter)
app.use("/chatbot", chatBotRouter);
app.use('/recommand', recommendationsRouter)
app.use('/spin', spinRouter)
app.use('/delivery', deliveryManRouter)



const PORT=process.env.PORT || 3000;


app.listen(PORT, ()=>{
    console.log(`server started at http://localhost:${PORT}`);
    connectDB()
})
