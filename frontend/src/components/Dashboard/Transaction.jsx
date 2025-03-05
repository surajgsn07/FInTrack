import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaEllipsisH } from "react-icons/fa";
import axiosInstance from "../../axiosConfig/axiosConfig";
import { useUser } from "../../utils/UserContext";
import moment from "moment";

import { BiLoaderCircle } from "react-icons/bi";

const Transactions = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState([]  )

  
  const [isLoading, setIsLoading] = useState(false);

  // Fetch transactions from backend
  const fetchAllTransactions = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`/transaction/all/${user}`);
      if (response.data) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.log("Error fetching transactions:", error);
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAllTransactions();
  }, [user]);

  return (

<div style={{padding:"10px"}} className="p-5">
  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-3">
    Recent Transactions
  </h2>

  {isLoading ? (
    <div className="flex justify-center w-full">
      <BiLoaderCircle size={30} className="animate-spin" />
    </div>
  ) : (
    <>
      {transactions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
      ) : (
        transactions.slice(0, 3).map((txn) => (
          <div
            key={txn._id}
            style={{padding:"8px" , marginBottom:"6px"}}
            className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            {/* Icon + Details */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Icon (Green for income, Red for expense) */}
              <div style={{padding:"4px"}} className={`p-2 rounded-full ${txn.amount > 0 ? "bg-green-700" : "bg-red-700"}`}>
                {txn.amount > 0 ? (
                  <FaArrowUp className="text-green-300" />
                ) : (
                  <FaArrowDown className="text-red-300" />
                )}
              </div>

              {/* Transaction Details */}
              <div>
                <h3 className="text-gray-900 dark:text-white font-medium">{txn.description}</h3>
                <p className="text-sm text-gray-500">{moment(txn.date).fromNow()}</p>
              </div>
            </div>

            {/* Category + Amount */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between">
              <span
              style={{padding:"3px 5px"}}
                className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  txn.amount > 0 ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                }`}
              >
                {txn.category?.name || "Other"}
              </span>

              {/* Amount (Green for income, Red for expense) */}
              <span className={`font-semibold ${txn.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                {txn.amount > 0 ? `Rs.${txn.amount.toFixed(2)}` : `Rs.${Math.abs(txn.amount).toFixed(2)}`}
              </span>
            </div>
          </div>
        ))
      )}
    </>
  )}
</div>

  );
};

export default Transactions;
