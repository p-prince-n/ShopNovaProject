import React from "react";
import { motion } from "framer-motion";
import { Gift, Star, Crown } from "lucide-react";

const ShopNovaPlusInfo = () => {
  const sections = [
    {
      title: "Get ShopNova Plus Membership Online and Unlock Exclusive Perks",
      content: `To make shopping more rewarding and inclusive, ShopNova has launched its 
      Plus Membership. This loyalty program strengthens customer relationships with 
      extra privileges. With ShopNova Plus, there’s no direct membership fee — 
      simply use your earned SuperCoins to unlock benefits. Members enjoy faster 
      delivery, early access to launches, priority support, exclusive payment options, 
      and partner rewards across travel, lifestyle, fitness, and entertainment.`,
      icon: Gift,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Everything You Should Know About ShopNova Plus",
      content: `ShopNova customers earn SuperCoins on every purchase. Once you collect 
      200 SuperCoins in a year, you’ll be invited to join Plus Membership. 
      For every ₹100 spent, you can earn up to 4 SuperCoins. These coins can be redeemed 
      for offers, vouchers, and services. With SuperCoin Pay and SuperCoin Exchange, 
      ShopNova members enjoy more flexibility and savings — especially in growing Tier 2+ cities.`,
      icon: Star,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Benefits of Being a ShopNova Plus Member",
      content: `As a Plus member, you earn up to 4 SuperCoins for every ₹100 spent. 
      Get early access to flash sales, special discounts, and priority assistance whenever needed. 
      ShopNova Plus also guarantees enrollment into ShopNova Pay Later, offering flexible payments. 
      Every purchase earns rewards that can be redeemed for recharges, vouchers, and lifestyle perks.`,
      icon: Crown,
      color: "text-yellow-600 dark:text-yellow-400",
    },
  ];

  return (
    <div className="px-2 md:px-10 xl:px-30 2xl:px-6s0 py-10  w-full mt-20">
        <div className="w-full px-4 md:px-12 lg:px-20 py-10 space-y-10 
                    text-gray-700 dark:text-gray-300 
                    bg-gray-50 dark:bg-gray-900 rounded-lg  ">
      {sections.map((section, idx) => {
        const Icon = section.icon;
        return (
          <motion.section
            key={idx}
            className="flex flex-col md:flex-row items-start gap-6 p-6 rounded-xl 
                       shadow-md border border-gray-200 dark:border-gray-700 
                       bg-white dark:bg-gray-800"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
          >
            {/* Icon */}
            <motion.div
              className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-md ${section.color} bg-gray-100 dark:bg-gray-700`}
              initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
              whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.3 }}
            >
              <Icon size={28} />
            </motion.div>

            {/* Text */}
            <div>
              <motion.h2
                className={`text-lg sm:text-xl md:text-2xl font-bold mb-3 ${section.color}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.4 }}
              >
                {section.title}
              </motion.h2>
              <motion.p
                className="leading-relaxed text-sm md:text-base"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.5 }}
              >
                {section.content}
              </motion.p>
            </div>
          </motion.section>
        );
      })}
    </div>
    </div>
  );
};

export default ShopNovaPlusInfo;
