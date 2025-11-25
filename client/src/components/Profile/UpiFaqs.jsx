import React from "react";

const faqs = [
  {
    question: "Why does ShopNova save my UPI details?",
    answer:
      "Saving your UPI ID helps speed up checkout. Instead of typing your UPI every time, you can simply choose your saved UPI ID while making a payment. This makes the process faster and still keeps it secure.",
  },
  {
    question: "Is storing my UPI information on ShopNova safe?",
    answer:
      "Yes, it’s completely safe. Your UPI ID is stored securely and is non-confidential information. ShopNova does not keep sensitive PCI data, so your details remain protected.",
  },
  {
    question: "What UPI details are actually stored by ShopNova?",
    answer:
      "ShopNova only saves your UPI ID and payment provider information. Sensitive data like your UPI PIN or MPIN is never stored.",
  },
  {
    question: "Am I allowed to remove my saved UPI details?",
    answer:
      "Of course! You can delete your UPI ID from your ShopNova account whenever you want.",
  },
];

const UpiFaqs = () => {
  return (<div className="w-full h-full py-10">
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md px-6 py-10">
      <div className="  flex-col items-start justify-start px-6 py-10 ">
        <h2 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-4">
          No VPAs saved to display
        </h2>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white/45 mb-6">FAQs</h1>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-400">
                {faq.question}
              </h3>
              <p className="text-sm text-gray-700 dark:text-blue-300 mt-2">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <a
          href="#"
          className="text-blue-600 hover:underline mt-8 text-sm font-medium py-6 "
        >
          View all FAQs &gt;
        </a>
      </div>
    </div>
    </div>
  );
};

export default UpiFaqs;
