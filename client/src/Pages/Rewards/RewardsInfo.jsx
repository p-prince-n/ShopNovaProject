import React from "react";
import { motion } from "framer-motion";
import { Trophy, Coins, Gift, PartyPopper } from "lucide-react";
import { useAuthStore } from "../../Store/authStore";
import SpinToWin from "../Home/Spin";

const RewardsInfo = () => {
  const rewards = [
    {
      title: "Earn SuperCoins on Every Order",
      content: `Every time you shop on ShopNova, you earn SuperCoins. 
      Collect them with every purchase and redeem them later for exciting offers.`,
      icon: Coins,
      color: "text-yellow-500 dark:text-yellow-400",
    },
    {
      title: "Exclusive Vouchers & Discounts",
      content: `Redeem your SuperCoins for vouchers across top brands in fashion, 
      electronics, lifestyle, and more. The more you shop, the more rewards you unlock!`,
      icon: Gift,
      color: "text-pink-500 dark:text-pink-400",
    },
    {
      title: "Celebrate With Bonus Rewards",
      content: `On special occasions like your birthday, festivals, or milestones, 
      earn bonus SuperCoins and enjoy surprise perks.`,
      icon: PartyPopper,
      color: "text-purple-500 dark:text-purple-400",
    },
    {
      title: "Be a Champion Shopper",
      content: `Top shoppers get highlighted as Reward Champions with premium benefits, 
      including priority service and exclusive deals.`,
      icon: Trophy,
      color: "text-green-500 dark:text-green-400",
    },
  ];
  const {user}=useAuthStore()
  if(user) return <SpinToWin/>

  return (
    <div className="px-2 md:px-10 xl:px-30 2xl:px-6s0 py-10 flex items-center  justify-center w-full  relative min-h-screen  overflow-y-scroll scrollbar-hide ">
      <div
        className=" w-7/8 md:w-3/4  absolute top-25 md:top-30  px-4 md:px-12 lg:px-20 py-12 space-y-12 
                    text-gray-700 dark:text-gray-300 
                    bg-gradient-to-b from-gray-50 to-white 
                    dark:from-gray-900 dark:to-gray-800 rounded-lg "
      >
        {rewards.map((reward, idx) => {
          const Icon = reward.icon;
          return (
            <motion.section
              key={idx}
              className="flex flex-col md:flex-row items-start gap-6 p-6 rounded-2xl 
                       shadow-lg border border-gray-200 dark:border-gray-700 
                       bg-white dark:bg-gray-800 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.25, type: "spring" }}
            >
              {/* Floating Background Glow */}
              <motion.div
                className="absolute -top-10 -left-10 w-32 h-32 rounded-full 
                         bg-gradient-to-tr from-yellow-300/20 to-pink-300/20 
                         dark:from-yellow-500/10 dark:to-pink-500/10 blur-2xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 20, -20, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Icon with Bounce Animation */}
              <motion.div
                className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center shadow-md ${reward.color} bg-gray-100 dark:bg-gray-700`}
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: idx * 0.3,
                  type: "spring",
                  bounce: 0.5,
                }}
                whileHover={{ scale: 1.15, rotate: 10 }}
              >
                <Icon size={30} />
              </motion.div>

              {/* Text Content */}
              <div className="relative z-10">
                <motion.h2
                  className={`text-lg sm:text-xl md:text-2xl font-bold mb-3 ${reward.color}`}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: idx * 0.4 }}
                >
                  {reward.title}
                </motion.h2>
                <motion.p
                  className="leading-relaxed text-sm md:text-base"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: idx * 0.5 }}
                >
                  {reward.content}
                </motion.p>
              </div>
            </motion.section>
          );
        })}

        {/* Call to Action */}
        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 text-white font-bold rounded-full shadow-lg 
                     bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500
                     dark:from-yellow-500 dark:via-pink-600 dark:to-purple-600"
          >
            Start Earning Rewards 🎉
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default RewardsInfo;
