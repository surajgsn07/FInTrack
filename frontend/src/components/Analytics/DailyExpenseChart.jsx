import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DailyExpensesChart = ({ data }) => {
  // Filter only negative values
  const negativeData = data.filter((item) => item.amount < 0);

  return (
    <div className="bg-white dark:bg-black p-4 rounded-lg">
      <h2 className="text-black dark:text-white text-lg font-semibold">Daily Expenses</h2>
      <p className="text-gray-400">March 2025</p>

      {!negativeData.length ? (
        <div className="bg-white dark:bg-black p-4 rounded-lg flex items-center justify-center h-[250px]">
          <p className="text-gray-400 dark:text-gray-500">No  expenses recorded</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={negativeData}>
            <XAxis 
              dataKey="date" 
              tick={{ fill: "currentColor" }} 
              className="text-black dark:text-white"
            />
            <YAxis 
              tick={{ fill: "currentColor" }} 
              className="text-black dark:text-white"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: "#1f2937", color: "white" }} 
              wrapperStyle={{ borderRadius: "8px" }}
            />
            <Bar 
              dataKey="amount" 
              barSize={20} 
              fill="#ff4d4d" // Always red for negative values
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default DailyExpensesChart;
