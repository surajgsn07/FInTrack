import React, { useEffect, useState } from 'react'
import { BiLoaderCircle } from "react-icons/bi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid , Legend } from "recharts";
import axiosInstance from '../../axiosConfig/axiosConfig';
import { useUser } from '../../utils/UserContext';
const Bargraph = () => {
    const {user} = useUser();
    const [data, setdata] = useState([])
    const [loading, setloading] = useState(false);


    const fetchData = async()=>{
        try {
            setloading(true)
            const response = await axiosInstance.get(`/transaction/monthly-transactions/${user}`);
            if(response.data){
                
                setdata(response.data);
            }
        } catch (error) {
            console.log("error : " , error);
        }finally{
            setloading(false);
        }
    }

    useEffect(() => {
        if(user) fetchData()
    }, [user])
    

    
    if(loading){
        return (
            <div className="min-h-[400px] w-full flex items-center justify-center">
  <BiLoaderCircle size={30} className="animate-spin" />
</div>

        )
    }

  return (
      
<div className="flex justify-center">
      <div
        style={{ marginTop: "10px" }}
        className="bg-white dark:bg-black rounded-lg p-5 mt-5 min-w-[300px] md:w-[60%] sm:w-[60%]"
      >
        <h2 className="text-black dark:text-white text-lg font-semibold mb-3">
          Monthly Transactions
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            {/* Grid with adaptive color */}
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />

            {/* Axis Labels with adaptive color */}
            <XAxis dataKey="month" tick={{ fill: "black dark:white" }} className="dark:fill-white" />
            <YAxis tick={{ fill: "black dark:white" }} className="dark:fill-white" />

            {/* Tooltip with dark/light mode styles */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                color: "#000",
              }}
              wrapperClassName="dark:bg-black dark:text-white"
            />

            {/* Legend for color reference */}
            <Legend />

            {/* Bars for Added (Income) and Expenditure */}
            <Bar dataKey="added" fill="#2ecc71" radius={[5, 5, 0, 0]} name="Added (Income)" />
            <Bar dataKey="expenditure" fill="#e63946" radius={[5, 5, 0, 0]} name="Expenditure (Expenses)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    
  )
}

export default Bargraph