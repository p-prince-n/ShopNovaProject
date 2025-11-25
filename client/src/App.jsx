import FloatingShap from "./components/FloatingShap";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import SignInPage from "./Pages/Auth/SignInPage";
import SignUpPage from "./Pages/Auth/SignUpPage";
import EmailVerificationPage from "./Pages/Auth/EmailVerificationPage";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "./Store/authStore";
import { useEffect } from "react";
import DashBoard from "./components/DashboardPage";
import LoadingSpinner from "./Pages/LoadingSpinner";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/Auth/ResetPasswordPage";
import PhoneVerificationPage from "./Pages/Auth/PhoneVerificationPage";
import Header from "./components/NavBar/Header";
import { useThemeStore } from "./Store/useThemeStore";
import Profile from "./Pages/Profile/Profile";
import AdminPage from "./Pages/Admin/AdminPage";
import CreateSellerPage from "./Pages/Seller/CreateSellerPage";
import SellerPage from "./Pages/Seller/SellerPage";
import Wishlist from "./Pages/Users/Wishlist";
import ProductDetail from "./Pages/Users/ProductDetail";
import Cart from "./Pages/Users/Cart";
import ProductPage from "./Pages/Share/ProductPage";
import QrScanProducts from "./Pages/Users/QrScanProducts";
import CategoryProduct from "./Pages/Home/CategoryProduct";
import ShopNovaPlusInfo from "./Pages/PluseZone/ShopNovaPlusInfo";
import RewardsInfo from "./Pages/Rewards/RewardsInfo";
import OrderList from "./Pages/Order/OrderList";
import ProductSearchPage from "./Pages/Home/ProductSearchPage";
import Footer from "./components/footer/Footer";
import DelivertPage from "./Pages/Delivery/DelivertPage";
import CreateDeliveryPage from "./Pages/Delivery/CreateDeliveryPage";
import AboutPage from "./Pages/Users/AboutPage";
import PrivacyPolicy from "./Pages/Users/PrivacyPolicy";
import AdminAnalytics from "./Pages/AdminAnalytics";
import DashOrder from "./components/Admin/DashOrder";
import PageNotFound from "./Pages/PageNotFound";

const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  if (!user.isMobileVerified) {
    return <Navigate to="/verify-phone" replace />;
  }

  return children;
};

const RedirectHomePage = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user && user.isVerified && user.isMobileVerified) {
    return <Navigate to={"/"} replace />;
  }
  return children;
};
const ProtectEmailVerification = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const ProtectSellerDetail = ({ children }) => {
  const { user } = useAuthStore();
  

  if (!user)  <Navigate to="/login" replace />;

  


  if (
    user.isSeller &&
    user.isSellerVerification
  ) {
    
     <Navigate to="/seller-page?tab=profile" replace />;
    
  }
  
   return children;

};

const ProtectDeliveryDetail = ({ children }) => {
  const { user } = useAuthStore();

  if (!user)  <Navigate to="/login" replace />;




  if (
    user?.isDeliveryMan &&
    user?.isDeliveryManVerification 
  ) {
    <Navigate to="/delivery-page?tab=profile" replace />;
  }


 return children;
};

const ProtectMobileVerification = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (user.isMobileVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AdminAccessPage = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || !user || !user.isVerified || !user.isAdmin) {
    toast.error("Only Admin Can access");
    return <Navigate to={"/home"} replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div
      className={`flex flex-col  overflow-y-scroll scrollbar-hide  bg-gradient-to-br ${
        theme === "light"
          ? "from-gray-800 via-blue-900 to-cyan-700"
          : "from-gray-900 via-green-900 to-emerald-900"
      }`}
    >
      <Header />
      {/* <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden "> */}
      <div
        className={`min-h-screen    flex items-center justify-center relative overflow-hidden`}
      >
        <FloatingShap

          color={theme === "light" ? "bg-[#56e8d5]" : "bg-green-500"}
          size="size-64"
          top="-5%"
          left="10%"
          delay={0}
        />
        <FloatingShap

          color={theme === "light" ? "bg-[#56e8d5]" : "bg-green-500"}
          size="size-48"
          top="70%"
          left="80%"
          delay={5}
        />
        <FloatingShap

          color={theme === "light" ? "bg-[#56e8d5]" : "bg-green-500"}
          size="size-32"
          top="40%"
          left="-5%"
          delay={2}
        />
        <Routes>
          <Route path="/Home" element={<HomePage />} />
          <Route
            path="/"
            element={
              <ProtectRoute>
                <DashBoard />
              </ProtectRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectRoute>
                <Wishlist />
              </ProtectRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectRoute>
                <Cart />
              </ProtectRoute>
            }
          />
          <Route path="/plus-zone" element={<ShopNovaPlusInfo />} />
          <Route path="/rewards" element={<RewardsInfo />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/analytic" element={<AdminAnalytics />} />
          <Route
            path="/orders"
            element={
              <ProtectRoute>
                <OrderList />
              </ProtectRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminAccessPage>
                <AdminPage />
              </AdminAccessPage>
            }
          />

          <Route path="/search" element={<ProductSearchPage />} />
          <Route path="/category/:id" element={<CategoryProduct />} />
          <Route path="/share" element={<ProductPage />} />
          <Route path="/qrscanproducts" element={<QrScanProducts />} />
          <Route path="/productdetail/:id" element={<ProductDetail />} />
          <Route
            path="/sign-up"
            element={
              <RedirectHomePage>
                <SignUpPage />
              </RedirectHomePage>
            }
          />
          <Route
            path="/data/:id"
            element={
              <ProtectRoute>
                <Profile />
              </ProtectRoute>
            }
          />
          <Route
            path="/sign-in"
            element={
              <RedirectHomePage>
                <SignInPage />
              </RedirectHomePage>
            }
          />
          <Route
            path="/verify-email"
            element={
              <ProtectEmailVerification>
                <EmailVerificationPage />
              </ProtectEmailVerification>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <RedirectHomePage>
                <ForgotPasswordPage />
              </RedirectHomePage>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <RedirectHomePage>
                <ResetPasswordPage />
              </RedirectHomePage>
            }
          />
          <Route
            path="/verify-phone"
            element={
              <ProtectMobileVerification>
                <PhoneVerificationPage />
              </ProtectMobileVerification>
            }
          />
          <Route
            path="/seller-data"
            element={
              <ProtectSellerDetail>
                <CreateSellerPage />
              </ProtectSellerDetail>
            }
          />
          <Route
            path="/delivery-data"
            element={
              <ProtectDeliveryDetail>
                <CreateDeliveryPage />
              </ProtectDeliveryDetail>
            }
          />
          <Route
            path="/seller-page"
            element={
              <ProtectSellerDetail>
              <SellerPage />
               </ProtectSellerDetail>
            }
          />
          <Route
            path="/delivery-page"
            element={
              <ProtectDeliveryDetail>
              <DelivertPage />
               </ProtectDeliveryDetail>
            }
          />
          <Route path="*" element={<PageNotFound/>} />
        </Routes>

        <Toaster />
      </div>
      <Footer />
    </div>
  );
}

export default App;
