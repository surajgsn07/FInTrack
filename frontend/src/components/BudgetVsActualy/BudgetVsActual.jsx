import React, { useEffect, useState } from "react";
import BudgetChart from "./BudgetChart";
import axiosInstance from "../../axiosConfig/axiosConfig";
import { useUser } from "../../utils/UserContext";
import BudgetTable from "./BudgetTable";

const BudgetVsActual = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();
  const {user} = useUser();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [data, setdata] = useState([]);

  const fetchData =async()=>{
    try {
        const response = await axiosInstance.post('/category/comparison' , {year : selectedYear , month : selectedMonth , userId : user})
        if(response.data){
                setdata(response.data);
        }
    } catch (error) {
        console.log("error : " , error)
    }
  }

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

  const years = Array.from({ length: 10 }, (_, i) => currentYear - i); // Last 10 years

  useEffect(() => {
    if(user)
        fetchData();
  }, [user , selectedMonth , selectedYear])
  

  return (
    <div className="flex flex-col items-center  min-h-screen" >
    <div className="flex flex-col items-center p-6 bg-white dark:bg-black text-black dark:text-white rounded-lg shadow-lg w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Select Month & Year</h2>
      <div className="flex flex-col sm:flex-row gap-6 w-full">
        {/* Year Selector */}
        <div className="w-full">
          <label className="block text-lg font-semibold mb-2 dark:text-white">Select Year</label>
          <select
            className="w-full bg-gray-200 dark:bg-black text-black dark:text-white text-lg px-4 py-3 rounded-lg border border-gray-400 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedYear}
            onChange={(e) => {
              const newYear = Number(e.target.value);
              setSelectedYear(newYear);
              if (newYear === currentYear && selectedMonth > currentMonth) {
                setSelectedMonth(currentMonth);
              }
            }}
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Month Selector */}
        <div className="w-full">
          <label className="block text-lg font-semibold mb-2 dark:text-white">Select Month</label>
          <select
            className="w-full bg-gray-200 dark:bg-black text-black dark:text-white text-lg px-4 py-3 rounded-lg border border-gray-400 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map(({ label, value }) => (
              <option
                key={value}
                value={value}
                disabled={selectedYear === currentYear && value > currentMonth}
              >
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

    <BudgetChart data={data} />

    
    <BudgetTable data={data} />
    
    </div>
  );
};

export default BudgetVsActual;