import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BudgetChart = ({ data=[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const batchSize = 3; // Show 3 categories at a time

  // Ensure spent amounts are positive for better comparison
  const formattedData = data.map((item) => ({
    ...item,
    spent: Math.abs(item.spent),
  }));

  // Get current batch of categories
  const currentBatch = formattedData.slice(currentIndex, currentIndex + batchSize);

  return (
    <div style={{marginTop:"50px"}} className="w-full bg-white dark:bg-black p-4 shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-4 text-center">
        Budget vs Actual Spending
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={currentBatch} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="budgetAmount" fill="#4CAF50" name="Budgeted Amount" barSize={30} />
          <Bar dataKey="spent" fill="#FF6B6B" name="Spent Amount" barSize={30} />
        </BarChart>
      </ResponsiveContainer>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
        style={{ padding: "12px 24px" }}
          className={`py-2  px-4 rounded font-bold text-white transition-all ${
            currentIndex > 0
              ? "bg-gradient-to-r cursor-pointer from-purple-400 to-pink-500 hover:opacity-90"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={() => setCurrentIndex((prev) => prev - batchSize)}
          disabled={currentIndex <= 0}
        >
          Previous
        </button>

        <button
        style={{ padding: "12px 24px" }}
          className={`py-2 px-4 rounded font-bold text-white transition-all ${
            currentIndex + batchSize < formattedData.length
              ? "bg-gradient-to-r cursor-pointer from-purple-400 to-pink-500 hover:opacity-90"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={() => setCurrentIndex((prev) => prev + batchSize)}
          disabled={currentIndex + batchSize >= formattedData.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BudgetChart;

const dummyData = [
  { category: "Food", budgetAmount: 500, spent: -450 },
  { category: "Rent", budgetAmount: 1200, spent: -1200 },
  { category: "Entertainment", budgetAmount: 300, spent: -250 },
  { category: "Transportation", budgetAmount: 200, spent: -180 },
  { category: "Shopping", budgetAmount: 400, spent: -350 },
  { category: "Utilities", budgetAmount: 600, spent: -550 },
  { category: "Medical", budgetAmount: 700, spent: -650 },
  { category: "Travel", budgetAmount: 800, spent: -750 },
  { category: "Insurance", budgetAmount: 900, spent: -850 },
  { category: "Education", budgetAmount: 1000, spent: -950 },
  { category: "Dining Out", budgetAmount: 450, spent: -400 },
  { category: "Subscriptions", budgetAmount: 200, spent: -180 },
  { category: "Charity", budgetAmount: 150, spent: -120 },
  { category: "Miscellaneous", budgetAmount: 350, spent: -320 },
];
