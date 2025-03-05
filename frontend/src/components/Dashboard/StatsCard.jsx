import React from 'react'

import { BiLoaderCircle } from "react-icons/bi";

const StatsCard = ({ title, amount, icon, bgColor, textColor, amountColor , text="" ,loading=false}) => {
    return (
      <div style={{padding:"10px"}} className={`rounded-lg p-5 w-full lg:w-1/3 m-2 ${bgColor}`}>
        {
            loading ? <>
            <div className='flex justify center flex-col' >
            <div className={`text-sm font-medium ${textColor}`}>{title} </div>  
            <div className='w-full min-h-10  flex justify-center item-center '>
            <BiLoaderCircle size={30} className="animate-spin" />
            </div>
            

            </div>
            </>:<><div className={`text-sm font-medium ${textColor}`}>{title} </div>
            <div className={`text-3xl font-bold ${amountColor}`}>{amount}</div>
            <div className={`flex items-center text-gray-400`}>
              {icon} <span className="ml-2">Total</span>
            </div></>
        }
        
      </div>
    );
  };

export default StatsCard