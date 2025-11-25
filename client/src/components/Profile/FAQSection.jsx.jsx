import React from "react";

const FAQSection = () => {
  const faqs = [
  {
    question: "What changes when I update my email address or mobile number?",
    answer:
      "Your registered email or phone number will be replaced with the new one. All future account notifications and messages will be sent to your updated contact details.",
  },
  {
    question: "How quickly will my ShopNova account reflect the updated email or phone number?",
    answer:
      "Your ShopNova account gets updated right after you verify the code sent to your new email or mobile and confirm the changes.",
  },
  {
    question:
      "Will my current ShopNova account stop working if I change my email address or mobile number?",
    answer:
      "No, changing your email or phone number won’t deactivate your account. You’ll still have full access to your orders, saved preferences, and personal details.",
  },
  {
    question: "Will updating my email also affect my Seller account?",
    answer:
      "Yes, since ShopNova uses a single sign-on system, any updates you make to your account information will automatically be applied to your Seller account as well.",
  },
];


  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg  shadow-2xl">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">FAQs</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index}>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              {faq.question}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-x-6">
        <button className="text-blue-600 hover:underline cursor-pointer">
          Deactivate Account
        </button>
        <button className="text-red-600 hover:underline cursor-pointer">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default FAQSection;
