import React, { useState } from "react";
import { useThemeStore } from "../../Store/useThemeStore";
import { useAuthStore } from "../../Store/authStore";
import FAQSection from "./FAQSection.jsx";
import { useNavigate } from "react-router-dom";

const PersonalInformation = () => {
  const { theme } = useThemeStore();
  const { user, updateProfile, resendEmailCode, resendMobileCode } =
    useAuthStore();
    const navigate=useNavigate()

  const [perInfo, setPerInfo] = useState(true);
  const [emailfield, setEmailfield] = useState(true);
  const [mobilefield, setMobilefield] = useState(true);

  const [data, setData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobileNumber || "",
    gender: user?.gender || "Other",
  });


  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };


  const handleSavePersonal = async () => {
    await updateProfile({ name: data.name, gender: data.gender });
    setPerInfo(true);
  };


  const handleSaveEmail = async () => {
    await updateProfile({ email: data.email });
    await resendEmailCode();
    setEmailfield(true);
  };


  const handleSaveMobile = async () => {
    await updateProfile({ mobileNumber: data.mobile });
    await resendMobileCode();
    setMobilefield(true);
    navigate('/verify-phone')
  };

  return (
    <>
      {/* Personal Info */}
      <div className="border-1 p-3 mt-6 rounded-xl shadow-2xl">
        <div className="flex flex-col">
          <div className="flex items-center justify-start gap-5 py-4 ">
            <h1 className="text-xl font-semibold dark:text-emerald-400">
              Personal Info
            </h1>
            <p
              onClick={() => setPerInfo(!perInfo)}
              className={`${
                perInfo ? "text-blue-700" : "text-red-600"
              } cursor-pointer hover:underline`}
            >
              {perInfo ? "Edit" : "Cancel"}
            </p>
          </div>
          <div className="flex items-center justify-start py-5 pt-1">
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              disabled={perInfo}
              placeholder="Full Name"
              className={`w-full md:w-3/7 px-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border border-green-400 transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
                  : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
              }`}
            />
          </div>
          {/* Gender */}
          <div className="flex flex-col justify-start gap-3 pb-3">
            <p className="text-md dark:text-emerald-400">Your Gender</p>
            <div className="px-2 md:px-10 flex gap-5 md:gap-12">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={data.gender === "Male"}
                  onChange={handleChange}
                  disabled={perInfo}
                />
                <span className="dark:text-emerald-400">Male</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={data.gender === "Female"}
                  onChange={handleChange}
                  disabled={perInfo}
                />
                <span className="dark:text-emerald-400">Female</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={data.gender === "Other"}
                  onChange={handleChange}
                  disabled={perInfo}
                />
                <span className="dark:text-emerald-400">Other</span>
              </label>
            </div>
          </div>

          {!perInfo && (
            <button
              onClick={handleSavePersonal}
              className="px-4 py-2 bg-blue-500 dark:bg-green-600 text-white rounded-lg w-fit hover:bg-green-700 transition"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col border-1 px-3 pb-3 mt-6 rounded-xl shadow-2xl">
        <div className="flex items-center justify-start gap-5 py-4 pt-10 ">
          <h1 className="text-xl font-semibold dark:text-emerald-400">
            Email Address
          </h1>
          <p
            onClick={() => setEmailfield(!emailfield)}
            className={`${
              emailfield ? "text-blue-700" : "text-red-600"
            } hover:underline cursor-pointer`}
          >
            {emailfield ? "Edit" : "Cancel"}
          </p>
        </div>
        <div className="flex items-center justify-start py-5 pt-0">
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            disabled={emailfield}
            placeholder="Enter Email"
            className={`w-full md:w-3/7 px-3 py-2 border-green-400 focus:ring-2 bg-opacity-50 rounded-lg border transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
                : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
            }`}
          />
        </div>
        {!emailfield && (
          <button
            onClick={handleSaveEmail}
            className="px-4 py-2 bg-blue-500 dark:bg-green-600 text-white rounded-lg w-fit hover:bg-green-700 transition"
          >
            Save & Verify
          </button>
        )}
      </div>

      {/* Mobile */}
      <div className="flex flex-col border-1 px-3 pb-3 mt-6 rounded-xl shadow-2xl">
        <div className="flex items-center justify-start gap-5 py-4 pt-10 ">
          <h1 className="text-xl font-semibold dark:text-emerald-400">
            Mobile Number
          </h1>
          <p
            onClick={() => setMobilefield(!mobilefield)}
            className={`${
              mobilefield ? "text-blue-700" : "text-red-600"
            } cursor-pointer hover:underline`}
          >
            {mobilefield ? "Edit" : "Cancel"}
          </p>
        </div>
        <div className="flex items-center justify-start py-5 pt-0">
          <input
            type="text"
            name="mobile"
            value={data.mobile}
            onChange={handleChange}
            disabled={mobilefield}
            placeholder="Enter Mobile Number"
            className={`w-full md:w-3/7 px-3 py-2 border-green-400 focus:ring-2 bg-opacity-50 rounded-lg border transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
                : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
            }`}
          />
        </div>
        {!mobilefield && (
          <button 
            onClick={handleSaveMobile}
            className="px-4 py-2 bg-blue-500 dark:bg-green-600 text-white rounded-lg w-fit hover:bg-green-700 transition"
          >
            Save & Verify
          </button>
        )}
      </div>

      {/* FAQ */}
      <div className="pb-10 mt-5 ">
        <FAQSection />
      </div>
    </>
  );
};

export default PersonalInformation;
