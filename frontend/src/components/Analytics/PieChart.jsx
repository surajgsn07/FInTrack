import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import React from 'react'

const data = [
    { name: "Food & Dining", value: 82, color: "#FF5722" },
    { name: "Entertainment", value: 189, color: "#4CAF50" },
  ];
const PieChartComponent = ({data=[]}) => {
  console.log({data})
  
  return (
    <div>
         <div className=" bg-white dark:bg-black p-4 rounded-xl">
      <h2 className=" text-black dark:text-white text-2xl font-semibold">Expense Categories</h2>
      <p className="text-gray-400">March 2025</p>

      {
        (!data || data.length == 0) ? <>
        <div className="bg-white dark:bg-black p-4 rounded-lg flex items-center justify-center h-[250px]">
            <p className="text-gray-400 dark:text-gray-500">No expenses recorded</p>
          </div></>:
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      }

    </div>
    </div>
  )
}

export default PieChartComponent;