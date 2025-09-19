import React from "react";

const faqs = [
  {
    question: "Why do I need to tokenize my card?",
    answer:
      "According to RBI’s new security rules, merchants like ShopNova are no longer allowed to store your full card details. Instead, banks and card networks provide a secure alternative called tokenisation, which replaces your actual card number with a unique code known as a 'token'. You can choose to save your card through tokenisation for future payments or continue without saving.",
  },
  {
    question: "What exactly is a token?",
    answer:
      "A token is a special code generated when you give permission to ShopNova to secure your card. It represents a combination of your card, the token requestor (ShopNova in this case), and your device. This token is created by the card network and does not contain personal card details. It is only issued when you use a new card for a valid transaction.",
  },
  {
    question: "Is tokenisation a safe option?",
    answer:
      "Yes, tokenisation adds extra safety. Since your real card number is never shared with ShopNova during payments, the chances of misuse are reduced. The card information is kept securely by authorised banks or card networks, and ShopNova never stores your 16-digit card number.",
  },
  {
    question: "Am I required to tokenize my card?",
    answer:
      "No, tokenisation is optional. You can decide whether you want to tokenize your card or continue without it.",
  },
  {
    question: "What if I don’t agree to tokenise my card?",
    answer:
      "If you choose not to tokenize your card, you’ll need to enter your card details manually each time you make a transaction, as required by RBI’s guidelines.",
  },
];

const CardFaqs = () => {
  return (
    <>
      <div className="w-full h-full py-10">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md px-6 py-10">
          <div className=" flex-col items-start justify-start px-6 py-10">
            <h2 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-4">
              Manage Saved Cards
            </h2>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white/45 mb-6">
              FAQs
            </h1>

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
            <div className="pt-10">
              <a
                href="#"
                className="text-blue-600 hover:underline mt-8 text-sm font-medium"
              >
                View all FAQs &gt;
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardFaqs;
