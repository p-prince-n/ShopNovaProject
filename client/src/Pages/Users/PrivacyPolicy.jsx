
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
      const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };
  return (
     <div className="min-h-screen   mt-15  md:py-10">
         <div className=" bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header Section */}
      <section className="text-center px-6 py-16">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeUp}
        >
          Privacy Policy
        </motion.h1>
        <motion.p
          className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          custom={1}
          variants={fadeUp}
        >
          At <span className="font-semibold text-blue-600">ShopNova</span>, we
          value your privacy and are committed to protecting your personal
          information. Please read this policy carefully to understand how we
          handle your data.
        </motion.p>
      </section>

      {/* Content Section */}
      <section className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {[
          {
            title: "1. Information We Collect",
            content:
              "We may collect personal details such as your name, email address, phone number, billing/shipping address, and payment information. We also collect browsing data (cookies, device info) to improve your shopping experience.",
          },
          {
            title: "2. How We Use Your Information",
            content:
              "Your information helps us process orders, deliver products, provide customer support, personalize recommendations, send promotional offers, and improve our services.",
          },
          {
            title: "3. Sharing of Information",
            content:
              "We do not sell your personal data. However, we may share your information with trusted third parties like payment gateways, delivery partners, or analytics providers strictly for order fulfillment and service improvements.",
          },
          {
            title: "4. Data Security",
            content:
              "We use strong security measures such as encryption, firewalls, and secure payment gateways to protect your data. However, no online service is completely risk-free, and we encourage safe browsing practices.",
          },
          {
            title: "5. Cookies & Tracking",
            content:
              "ShopNova uses cookies to enhance your experience by remembering preferences and showing relevant offers. You may disable cookies in your browser settings, but some features may not work properly.",
          },
          {
            title: "6. Your Rights",
            content:
              "You have the right to access, update, or delete your personal information. You can also unsubscribe from promotional emails anytime.",
          },
          {
            title: "7. Changes to this Policy",
            content:
              "We may update this Privacy Policy from time to time. Any significant changes will be communicated on this page with an updated 'Last Updated' date.",
          },
          {
            title: "8. Contact Us",
            content:
              "If you have any questions regarding this Privacy Policy or how your data is handled, please contact us at support@shopnova.com.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow p-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            custom={i * 0.5}
            variants={fadeUp}
          >
            <h2 className="text-2xl font-semibold mb-3">{item.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {item.content}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Animated Call-to-Action */}
      <section className="px-6 py-16 bg-blue-600 text-white text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeUp}
        >
          Your Privacy Matters to Us
        </motion.h2>
        <motion.p
          className="max-w-2xl mx-auto mb-6 text-lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          custom={1}
          variants={fadeUp}
        >
          We’re dedicated to creating a secure and transparent shopping
          experience for every ShopNova customer.
        </motion.p>
        <motion.a
          href="/contact"
          className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow hover:bg-gray-200 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Contact Support
        </motion.a>
      </section>

      {/* Footer Section */}
      <footer className="px-6 py-10 bg-gray-100 dark:bg-gray-800 text-center">
        <motion.p
          className="text-gray-600 dark:text-gray-400 text-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={fadeUp}
        >
          Last Updated: {new Date().toLocaleDateString()}
          <br /> © {new Date().getFullYear()} ShopNova. All Rights Reserved.
        </motion.p>
      </footer>
    </div>
     </div>
    
  );
}
