import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { useOrderStore } from "../Store/useOrderStore";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export default function AdminAnalytics() {
  const { fetchAdminAnalytics, adminAnalytics, loading } = useOrderStore();
  console.log(adminAnalytics);

  useEffect(() => {
    fetchAdminAnalytics();
  }, [fetchAdminAnalytics]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold animate-pulse">
        Loading analytics...
      </div>
    );

  const {
    monthlyData,
    orderStatus,
    revenueBySeller,
    topProducts,
    dailyOrders,
  } = adminAnalytics;
  console.log(revenueBySeller);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 md:p-10 space-y-12 overflow-x-hidden">
      <motion.h1
        className="text-2xl md:text-3xl font-extrabold text-center mb-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Admin Analytics Dashboard
      </motion.h1>

      {/* Grid layout for charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Monthly Sales Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-3 text-center">
            Monthly Sales & Orders
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#10b981"
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Status Pie Chart */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-3 text-center">
            Order Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={orderStatus}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {orderStatus?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />

              {/* Legend shows color mapping */}
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: "14px", fontWeight: "bold" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue by Seller */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-3 text-center">
            Revenue Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueBySeller}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sellerName" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
              <Legend />
              <Bar dataKey="totalRevenue" fill="#f59e0b" name="Total Revenue" />
              <Bar dataKey="sellerRevenue" fill="#10b981" name="Seller Share" />
              <Bar dataKey="adminRevenue" fill="#ef4444" name="Admin Share" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Selling Products */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all md:col-span-2 lg:col-span-1"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-3 text-center">
            Top Selling Products
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="productName" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="totalSold" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Daily Orders Trend */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all md:col-span-2 lg:col-span-2"
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-xl font-bold mb-3 text-center">
            Daily Orders (Last 7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dailyOrders}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="_id.day" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="totalOrders"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorOrders)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
