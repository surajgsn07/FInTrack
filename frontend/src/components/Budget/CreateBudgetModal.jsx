import React, { useState } from "react";
import axiosInstance from "../../axiosConfig/axiosConfig";
import { useUser } from "../../utils/UserContext";
import { toast } from "react-toastify";

const BudgetModal = ({ category, onClose, onSuccess }) => {
  const { user } = useUser();
  const [amount, setAmount] = useState("");
  const [isSettingBudget, setIsSettingBudget] = useState(false);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      setIsSettingBudget(true);
      const response = await axiosInstance.post("/budget/create", {
        userId: user,
        category: category, 
        monthlyLimit: amount,
        month: currentMonth,
        year: currentYear,
      });

      if (response.data) {
        toast.success("Budget added successfully!");
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error setting budget:", error);
      toast.error("Error setting budget");
    } finally {
      setIsSettingBudget(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-[#121212] shadow-lg rounded-lg w-full max-w-md" style={{ padding: "24px" }}>
        <h2 className="text-center text-2xl font-bold mb-5">Set Budget</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Category (Read-only) */}
          

          {/* Amount Input */}
          <div className="mb-4">
            <label className="text-lg font-semibold">Monthly Limit</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full dark:bg-black dark:text-white dark:border-gray-600 bg-gray-200 border border-gray-300 rounded-lg"
              style={{ padding: "12px", marginTop: "8px" }}
              placeholder="Enter budget amount"
              min="1"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full text-white font-semibold rounded-lg bg-gradient-to-r from-purple-700 to-red-600 transition-all ease-in-out"
            style={{ padding: "14px", fontSize: "18px", marginTop: "16px" }}
          >
            {isSettingBudget ? "Loading..." : "Set Budget"}
          </button>
        </form>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full text-gray-700 dark:text-gray-300 font-semibold mt-3"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BudgetModal;
