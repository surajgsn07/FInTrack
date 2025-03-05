import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig/axiosConfig";
import { useUser } from "../../utils/UserContext";
import PieChartComponent from "./PieChart";
import DailyExpensesChart from "./DailyExpenseChart";

const Analytics = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();
  const {user} = useUser();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryWiseData, setcategoryWiseData] = useState([]);
  const [dailyExpenseData, setdailyExpenseData] = useState([])
  const [expenses, setexpenses] = useState(0);
  const [income, setincome] = useState(0)

  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // Descending order

  const fetchReport = async()=>{
    try {
        setIsLoading(true)
        const response = await axiosInstance.post("/transaction/report" , {
            year : selectedYear ,
            month : selectedMonth,
            userId : user
        })
        if(response.data){
            console.log("res.data : " , response.data)
            
            const totalSpend = response.data.categoryWiseSpending.reduce(
                (sum, cat) => sum + Math.abs(cat.amount), // Convert to absolute to avoid negative values
                0
              );
              const categoryData = response.data.categoryWiseSpending.map((cat) => {
                return {
                  name: cat.category,
                  color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, 
                  value:(cat.amount/totalSpend)*100
                };
            });
            setcategoryWiseData(categoryData)
            setdailyExpenseData(response.data.dailySpending);
            setincome(response.data.totalIncome);
            setexpenses(response.data.totalExpenses);
        }
    } catch (error) {
        console.log("Error : " , error)
    }finally{
        setIsLoading(false);
    }
  }

  useEffect(() => {
    if(user && selectedMonth && selectedYear)fetchReport();
  }, [user , selectedMonth , selectedYear])

  if(isLoading){
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-6 border-gradient-to-r from-purple-400 to-pink-500"></div></div>
  }
  


  return (
    <>
    
      <h2 className="text-2xl font-bold mb-8 dark:text-white">Analytics</h2>
    <div style={{marginBottom:"20px"}} className="  flex flex-col  items-center bg-white dark:bg-black text-black dark:text-white px-6 transition-colors duration-300">

      {/* Selectors Container */}
      <div className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-black p-6 rounded-lg shadow-lg w-full max-w-lg transition-colors duration-300">
        {/* Year Selector */}
        <div className="w-full">
          <label className="block text-lg font-semibold mb-2 dark:text-white">Select Year</label>
          <select
            className="w-full bg-gray-200 dark:bg-black text-black dark:text-white text-lg px-4 py-3 rounded-lg border border-gray-400 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={selectedYear}
            onChange={(e) => {
              const newYear = Number(e.target.value);
              setSelectedYear(newYear);

              // If switching to current year and selected month is in the future, reset to current month
              if (newYear === currentYear && selectedMonth > currentMonth) {
                setSelectedMonth(currentMonth);
              }
            }}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Month Selector */}
        <div className="w-full">
          <label className="block text-lg font-semibold mb-2 dark:text-white">Select Month</label>
          <select
            className="w-full bg-gray-200 dark:bg-black text-black dark:text-white text-lg px-4 py-3 rounded-lg border border-gray-400 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map(({ label, value }) => (
              <option
                key={value}
                value={value}
                disabled={selectedYear === currentYear && value > currentMonth} // Disable future months if year is current
              >
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>


    </div>

    <div style={{margin:"50px 0px"}} className="flex gap-4 my-12 flex-col md:flex-row">
  {/* Income Card */}
  <div style={{padding:"10px"}} className="bg-gradient-to-br from-green-200 to-white dark:from-green-900 dark:to-black p-4 rounded-lg md:w-1/2 border border-gray-300 dark:border-gray-700">
    <h2 className="text-gray-700 dark:text-gray-300">Income</h2>
    <p className="text-green-600 dark:text-green-400 text-2xl font-semibold">Rs.{income.toFixed(2)}</p>
  </div>

  {/* Expenses Card */}
  <div style={{padding:"10px"}} className="bg-gradient-to-br from-red-200 to-white dark:from-red-900 dark:to-black p-4 rounded-lg md:w-1/2 border border-gray-300 dark:border-gray-700">
    <h2 className="text-gray-700 dark:text-gray-300">Expenses</h2>
    <p className="text-red-600 dark:text-red-400 text-2xl font-semibold">Rs.{expenses.toFixed(2)}</p>
  </div>
</div>

<div className=" w-full overflow-hidden">
  <PieChartComponent data={categoryWiseData} />
</div>

<div className="  w-full overflow-hidden">
  <DailyExpensesChart data={dailyExpenseData} />
</div>


    
    </>
  );
};

export default Analytics;
