# 🛍️ ShopNova - Modern Futuristic Shopping Experience

ShopNova is a **next-generation e-commerce platform** that redefines online shopping with a modern UI, AI-powered chatbot, real-time order tracking, and advanced admin, seller, delivery, and user management features.

---

## 🚀 Features

### 🧑‍💼 **Admin Panel**
- 📊 View dashboard analytics:
  - Graphs for revenue, orders, and performance
  - Top 4 products
  - Last 7 days of orders and revenue stats
- 💰 Revenue split:
  - **Admin**: 20%  
  - **Seller**: 80%
- 📂 Manage Data:
  - View, create, update, and delete **Users**, **Products**, **Categories**, **Sellers**, **Delivery Men**
- ✅ Verify:
  - Sellers and Delivery Men before activation
- 📦 Manage Orders:
  - View all order statuses and filter by status
- 📥 Export Excel reports for:
  - Users, Sellers, DeliveryMen, Products
- 📉 Monitor performance in real time

---

### 👤 **User Features**
- 🔐 Login, Registration, OTP verification (Email + Phone)
- ✏️ Update Profile
- 📍 Manage Addresses:
  - Add address manually or by current location
  - Set default address
  - Update & delete addresses
- 🛒 Cart Management:
  - Add to cart
  - Update quantity
  - Order directly from cart or product page
- ❤️ Wishlist & Reviews:
  - Add to wishlist
  - Give product reviews
- 🎁 Spin to Win:
  - Win discounts valid for **24 hours**
- 🧾 Forgot Password & Resend OTP
- 📦 Order Tracking:
  - Get SMS & Email updates for order status changes
- 🌦️ Location-based Products:
  - Get product suggestions by **city and current weather**
- 🔗 Share Product:
  - Generate and share product QR code

---

### 🏪 **Seller Features**
- 📝 Seller Registration & Profile Update
- 🛍️ Order Management:
  - View all orders related to seller’s categories
- 🚚 Product Shipping:
  - Ship assigned orders
- 💰 Revenue Sharing:
  - Seller receives 80% of revenue

---

### 🚴‍♂️ **Delivery Man Features**
- 🚀 Register and Update Profile
- 📦 Assigned Deliveries:
  - View shipped products to deliver
  - Mark deliveries as completed
- 🔐 Delivery Verification:
  - OTP verification (Email & Phone) before confirming delivery
- 📬 Real-time SMS & Email updates to users when order status changes

---

### 🤖 **Chatbot Integration**
- Users can ask for any product via AI Chatbot for instant recommendations.

---

## ⚙️ Tech Stack

### 🖥️ **Frontend**
- **React 19**
- **Vite**
- **Tailwind CSS**
- **Zustand** (State Management)
- **Axios**
- **Framer Motion**
- **Flowbite React**
- **Recharts**
- **React Router DOM**
- **React Hot Toast**
- **React Icons**
- **Moment.js**
- **QR Code React**
- **React Share**

---

### 🗄️ **Backend**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **bcryptjs** (Password Hashing)
- **Multer** (File Uploads)
- **ExcelJS** & **xlsx** (Excel Export)
- **Nodemailer** & **Mailtrap** (Emails)
- **Twilio** (SMS)
- **dotenv**
- **cookie-parser**
- **cors**
- **crypto**
- **nanoid**
- **Jimp**
- **OpenAI API**
- **@google/genai**
- **@xenova/transformers**
- **compromise** (NLP Support)
- **nodemon** (Dev Environment)

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/p-prince-n/ShopNova
cd ShopNova


## ⚙️ Setup Instructions

### 🖥️ Backend Setup
```bash
cd server
npm install
npm run dev


cd client
npm install
npm run dev


PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_URL=your_cloudinary_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
OPENAI_API_KEY=your_openai_key


Admin Dashboard Highlights

📈 Real-time Graphs (Revenue, Orders, Top Products)

📥 Excel Download for all data

✅ Delivery & Seller Verification

📅 7-Day Revenue Summary

🧠 AI & Automation

🤖 Chatbot for product assistance using OpenAI + Google GenAI

📩 Automated Email & SMS notifications

🎯 Spin to Win gamified discount feature

📱 Responsive Design

💻 Fully optimized for desktop, tablet, and mobile devices

🎨 Built using Tailwind CSS and Flowbite React