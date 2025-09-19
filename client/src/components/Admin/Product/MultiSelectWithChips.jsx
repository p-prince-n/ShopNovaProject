import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MultiSelectWithChips = ({ label, options, selected, onChange, theme }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState("");
  const dropdownRef = useRef(null);

  const toggleValue = (value) => {
    if (value === "Other") {
      setShowOtherInput(true);
      setDropdownOpen(false);
      return;
    }
    const alreadySelected = selected.includes(value);
    const updated = alreadySelected
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(updated);
  };

  const handleOtherSubmit = () => {
    if (otherValue.trim() !== "") {
      onChange([...selected, otherValue.trim()]);
      setOtherValue("");
      setShowOtherInput(false);
    }
  };

  return (
    <div className="my-3 relative">
      <label className="block mb-2 font-semibold dark:text-green-400">
        {label}
      </label>

      {/* Selected chips */}
      <div className="flex flex-wrap gap-2 mt-2">
        {selected.map((val) => (
          <div
            key={val}
            className={`flex items-center gap-1 px-2 py-1 bg-opacity-50 rounded-full border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-gray-300 border-blue-700 text-black"
            }`}
          >
            <span>{val}</span>
            <button
              type="button"
              onClick={() => toggleValue(val)}
              className="font-bold ml-1 text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Dropdown input */}
      <div
        ref={dropdownRef}
        className={`mt-2 focus:ring-2 bg-opacity-50 rounded-lg border cursor-pointer ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-gray-300 border-blue-700 text-black"
        } p-2`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {selected.length > 0 ? selected.join(", ") : `Select ${label}`}
      </div>

      {/* Dropdown list */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute rounded-xl top-full left-0 right-0 bg-white dark:bg-emerald-600 border shadow-lg z-50 max-h-48 overflow-y-auto"
          >
            {options.concat("Other").map((opt) => (
              <li
                key={opt}
                className="p-2 hover:bg-gray-200 dark:hover:bg-emerald-300 cursor-pointer"
                onClick={() => toggleValue(opt)}
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Other input */}
      {showOtherInput && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={otherValue}
            onChange={(e) => setOtherValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleOtherSubmit()}
            placeholder="Enter custom ingredient"
            className={`px-3 py-1 rounded-lg border focus:ring-2 outline-none ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600 text-white"
                : "bg-white border-gray-400 text-black"
            }`}
          />
          <button
            type="button"
            onClick={handleOtherSubmit}
            className="px-3 py-1 rounded-lg bg-green-500 text-white"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiSelectWithChips;
