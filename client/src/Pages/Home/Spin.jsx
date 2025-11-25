import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useThemeStore } from "../../Store/useThemeStore";
import { useSpinStore } from "../../Store/useSpinStore";
import { useAuthStore } from "../../Store/authStore";
import SpinCardGrid from "./SpinCard";

const segments = [
  { value: 1, label: "1% off", colorLight: "#f87171", colorDark: "#ef4444" },
  { value: 2, label: "3% off", colorLight: "#60a5fa", colorDark: "#3b82f6" },
  { value: 3, label: "5% off", colorLight: "#34d399", colorDark: "#10b981" },
  { value: 4, label: "7% off", colorLight: "#fbbf24", colorDark: "#d97706" },
  { value: 5, label: "10% off", colorLight: "#a78bfa", colorDark: "#8b5cf6" },
  { value: 6, label: "13% off", colorLight: "#f472b6", colorDark: "#db2777" },
  { value: 7, label: "17% off", colorLight: "#38bdf8", colorDark: "#0284c7" },
  { value: 8, label: "21% off", colorLight: "#4ade80", colorDark: "#16a34a" },
  { value: 9, label: "23% off", colorLight: "#fb923c", colorDark: "#ea580c" },
  { value: 10, label: "25% off", colorLight: "#c084fc", colorDark: "#9333ea" },
];

const getWeightedRandom = () => {
  const weights = [25, 25, 20, 15, 10, 2, 1, 1, 0.5, 0.5];
  const total = weights.reduce((a, b) => a + b, 0);
  const rand = Math.random() * total;
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (rand <= sum) return i;
  }
  return 0;
};

const SpinToWin = () => {
  const { user } = useAuthStore();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const { theme } = useThemeStore();
  const [tick, setTick] = useState(0);

  const { createSpin, getNextSpinTime, getUserSpins, spins } = useSpinStore();

  const [nextSpinAvailable, setNextSpinAvailable] = useState(true);
  const [countdown, setCountdown] = useState(null);


  useEffect(() => {
    if (user) getUserSpins();
  }, [user, getUserSpins]);


  useEffect(() => {
    const fetchNextSpin = async () => {
      if (!user) return;
      const data = await getNextSpinTime();
      setNextSpinAvailable(data?.nextSpinAvailable ?? true);
      if (!data?.nextSpinAvailable && data?.remainingMs) {
        setCountdown(Date.now() + data.remainingMs);
      }
    };
    fetchNextSpin();
  }, [user, getNextSpinTime]);


  useEffect(() => {
    if (!countdown) return;
    const timer = setInterval(() => {
      if (Date.now() >= countdown) {
        setCountdown(null);
        setNextSpinAvailable(true);
      }
      setTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const spinWheel = async () => {
    if (!user) {
      alert("Please login to spin!");
      return;
    }
    if (spinning || !nextSpinAvailable) return;

    setSpinning(true);

    const randomIndex = getWeightedRandom();
    const degreesPerSegment = 360 / segments.length;
    const newRotation =
      rotation +
      360 * 6 +
      (segments.length - randomIndex) * degreesPerSegment -
      degreesPerSegment / 2;

    setRotation(newRotation);

    setTimeout(async () => {
      const wonLabel = segments[randomIndex].label;
      setResult(wonLabel);
      setSpinning(false);

      if (user) {
        await createSpin({ value: Number(wonLabel.split("%")[0]) });
        const data = await getNextSpinTime();
        setNextSpinAvailable(data?.nextSpinAvailable ?? true);
        if (!data?.nextSpinAvailable && data?.remainingMs) {
          setCountdown(Date.now() + data.remainingMs);
        }
      }
    }, 5000);
  };

  const formatCountdown = () => {
    if (!countdown) return "";
    const diff = countdown - Date.now();
    if (diff <= 0) return "";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const gradient = `conic-gradient(${segments
    .map((seg, i) => {
      const color = theme === "dark" ? seg.colorDark : seg.colorLight;
      const start = (i * 360) / segments.length;
      const end = ((i + 1) * 360) / segments.length;
      return `${color} ${start}deg ${end}deg`;
    })
    .join(", ")})`;
    console.log({spins});
    

  return (
    <div className="min-h-full min-w-full flex flex-col items-center justify-center px-5 md:px-10 lg:px-20 xl:px-40 mt-20">
      <div
        className={`h-full w-full py-30 flex flex-col items-center justify-center transition-colors duration-500 ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
          <div className="absolute z-20 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[24px] border-l-transparent border-r-transparent border-b-white dark:border-b-black/80 mb-2"></div>
            <button
              onClick={spinWheel}
              disabled={!user || spinning || !nextSpinAvailable}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-transform ${
                user && nextSpinAvailable
                  ? "bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 animate-pulse"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {spinning ? "..." : "SPIN"}
            </button>
          </div>

          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 5, ease: "easeOut" }}
            className="absolute w-full h-full rounded-full border-[10px] border-yellow-500 shadow-2xl flex items-center justify-center"
            style={{ background: gradient }}
          >
            {segments.map((seg, i) => {
              const segmentsCount = segments.length;
              const anglePerSegment = 360 / segmentsCount;
              const angle = i * anglePerSegment;
              const radius = 110;

              return (
                <div
                  key={i}
                  className="absolute text-[10px] md:text-sm font-bold text-white flex items-center justify-center"
                  style={{
                    width: "max-content",
                    transform: `rotate(${
                      angle + anglePerSegment / 2
                    }deg) translateY(-${radius}px) rotate(-${
                      angle + anglePerSegment / 2
                    }deg)`,
                    transformOrigin: "center center",
                    textAlign: "center",
                    textShadow: "1px 1px 2px black",
                  }}
                >
                  {seg.label}
                </div>
              );
            })}
          </motion.div>
        </div>

        {!nextSpinAvailable && countdown && (
          <div className="mt-8 text-lg font-semibold text-red-500">
            ⏳ Next spin in: {formatCountdown()}
          </div>
        )}

        {!user && (
          <div className="mt-8 text-lg font-semibold text-yellow-500">
            Please login to spin and view your codes!
          </div>
        )}

        {result && nextSpinAvailable && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 text-xl md:text-2xl font-bold text-yellow-600 dark:text-yellow-400"
          >
            🎉 You won: {result}
          </motion.div>
        )}

        {user && <SpinCardGrid theme={theme} spinData={spins} />}
      </div>
    </div>
  );
};

export default SpinToWin;
