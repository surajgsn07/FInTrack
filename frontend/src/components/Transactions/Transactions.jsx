import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaEllipsisH, FaSearch } from "react-icons/fa";
import axiosInstance from "../../axiosConfig/axiosConfig";
import { useUser } from "../../utils/UserContext";

import { BiLoaderCircle } from "react-icons/bi";

const Transactions = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState([
  ]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);

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

  const filteredTransactions = transactions
    .filter((txn) => txn.description.toLowerCase().includes(search.toLowerCase()))
    .filter((txn) => (categoryFilter === "all" ? true : txn.category.name === categoryFilter))
    .filter((txn) =>
      typeFilter === "all" ? true : typeFilter === "income" ? txn.amount > 0 : txn.amount < 0
    )
    .sort((a, b) => (sortOrder === "newest" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)));

    useEffect(() => {
        if(user)fetchAllTransactions();
    }, [user])
    

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors" style={{ padding: "20px" }}>
      <div className="flex justify-between items-center" style={{ marginBottom: "16px" }}>
        <h2 className="text-2xl font-bold">Transactions</h2>
      </div>

      

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 rounded-lg" style={{ padding: "12px", marginBottom: "16px" }}>
        <FaSearch className="text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent focus:outline-none text-black dark:text-white"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2" style={{ marginBottom: "16px" }}>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
          style={{ padding: "8px", minWidth: "120px" }}
        >
          <option value="all">All Categories</option>
          <option value="Food">Food</option>
          <option value="Income">Income</option>
          <option value="Utilities">Utilities</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-md bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
          style={{ padding: "8px", minWidth: "120px" }}
        >
          <option value="all">All Transactions</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="rounded-md bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
          style={{ padding: "8px", minWidth: "120px" }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {
        isLoading && (
            <div className="flex justify-center w-full">
                  <BiLoaderCircle size={30} className="animate-spin" />
                </div>
        )
      }

      {/* Transactions List */}
      <div style={{ marginBottom: "16px" }}>
      {filteredTransactions.length === 0 && (
    <div className="text-gray-600 dark:text-gray-400 flex justify-center items-center" style={{ padding: "16px" }}>
        No transactions found.
    </div>
)}

        {filteredTransactions.map((transaction) => (
          <div
            key={transaction._id}
            className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md"
            style={{ padding: "16px", marginBottom: "12px" }}
          >
            <div>
              <h3 className="font-semibold">{transaction.description}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
                <span className={`rounded-md text-md bg-${
                    transaction.amount < 0 ? "red-500" : "green-500"
                } font-semibold `} style={{padding:"2px 5px"}} >{transaction?.category ? transaction.category.name : "Other"}</span>
              <span
                className={`text-lg font-bold ${
                  transaction.amount < 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {transaction.amount < 0 ? <FaArrowDown /> : <FaArrowUp />}
                Rs.{Math.abs(transaction.amount).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
