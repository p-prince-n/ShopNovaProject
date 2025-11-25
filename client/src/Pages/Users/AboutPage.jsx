
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen   mt-15  md:py-10">
        <div className=" bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold mb-4 text-black/65 dark:text-green-200"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          Welcome to <span className="text-black dark:text-white">Shop<span className="text-green-600">Nova</span></span>
        </motion.h1>

        <motion.p
          className="max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          We are more than just an e-commerce platform — we are your trusted
          partner in finding products you love, discovering trends, and enjoying
          a smooth shopping journey anywhere, anytime.
        </motion.p>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.img
            src="https://via.placeholder.com/500x400"
            alt="ShopNova Mission"
            className="rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          />

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              At ShopNova, our mission is to revolutionize online shopping by
              offering products that blend quality, affordability, and trust.
              With cutting-edge technology and excellent service, we aim to
              bring joy and convenience to your everyday life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We envision ShopNova as a one-stop global destination where every
              customer feels confident and excited to shop. We want to empower
              businesses, support local sellers, and connect buyers with unique
              products worldwide.
            </p>
          </motion.div>

          <motion.img
            src="https://via.placeholder.com/500x400"
            alt="ShopNova Vision"
            className="rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-20 bg-gray-50 dark:bg-gray-800">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          What Makes Us Different
        </motion.h2>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Customer First", desc: "We prioritize your needs, feedback, and satisfaction in everything we do." },
            { title: "Secure & Reliable", desc: "Your privacy and payments are always protected with top-notch security." },
            { title: "Fast Delivery", desc: "We ensure speedy and reliable delivery right to your doorstep." },
            { title: "Wide Range", desc: "From fashion to electronics — ShopNova offers products across every category." },
            { title: "24/7 Support", desc: "Our team is always here to assist you, whenever you need us." },
            { title: "Innovation", desc: "We keep evolving with trends and technology to serve you better." },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ delay: i * 0.2, duration: 0.7 }}
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="px-6 py-20">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          Meet Our Team
        </motion.h2>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { name: "Alex Carter", role: "Founder & CEO" },
            { name: "Sophia Lee", role: "Head of Marketing" },
            { name: "Daniel Kim", role: "Tech Lead" },
            { name: "Emma Johnson", role: "Customer Success" },
          ].map((person, i) => (
            <motion.div
              key={i}
              className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-300 dark:bg-gray-700 mb-4" />
              <h3 className="text-lg font-semibold">{person.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{person.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="px-6 py-20 bg-blue-600 text-white text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          Join the ShopNova Journey
        </motion.h2>
        <motion.p
          className="max-w-2xl mx-auto mb-8 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Be part of a growing community of smart shoppers and sellers. Together,
          let’s build the future of e-commerce.
        </motion.p>
        <motion.a
          href="/home"
          className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow hover:bg-gray-200 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Shopping
        </motion.a>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 bg-gray-100 dark:bg-gray-800 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} ShopNova. All Rights Reserved.
        </p>
      </footer>
    </div>
    </div>
    
  );
}
