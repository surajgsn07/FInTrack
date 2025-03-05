import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig/axiosConfig";
import { useUser } from "../../utils/UserContext";

const MakeBudget = () => {
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const { user } = useUser();
  const [categoryList, setCategoryList] = useState([]);
  const [isSettingBudget, setIsSettingBudget] = useState(false);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`/category/all/${user}`);
      if (response.data) {
        setCategoryList(response.data.categories);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!monthlyLimit || monthlyLimit <= 0) {
      alert("Enter a valid monthly limit");
      return;
    }
    
    const finalCategory = isCustomCategory ? customCategory : category;
    console.log({ category: finalCategory, monthlyLimit, month, year });
    
    try {
        setIsSettingBudget(true)
      const response = await axiosInstance.post("/budget/create", {
        userId: user,
        category: finalCategory,
        monthlyLimit,
        month,
        year,
      });

      if (response.data) {
        alert("Budget added successfully!");
        setCategory("");
        setCustomCategory("");
        setIsCustomCategory(false);
        setMonthlyLimit("");
        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
      }
    } catch (error) {
      console.log("Error adding budget:", error);
    }finally{
        setIsSettingBudget(false);
    }
  };

  useEffect(() => {
    if (user) fetchCategories();
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100 dark:bg-black dark:text-white">
      <div className="bg-white dark:bg-[#121212] shadow-lg rounded-xl w-full max-w-md" style={{ padding: "24px" }}>
        <h2 className="text-center text-2xl font-bold mb-5">Set Monthly Budget</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-lg font-semibold">Category</label>
            <select
              value={category}
              onChange={(e) => {
                if (e.target.value === "custom") {
                  setIsCustomCategory(true);
                  setCategory("");
                } else {
                  setIsCustomCategory(false);
                  setCategory(e.target.value);
                }
              }}
              className="w-full dark:bg-black dark:text-white dark:border-gray-600 bg-gray-200 border border-gray-300 rounded-lg"
              style={{ padding: "12px", marginTop: "8px" }}
            >
              <option value="">Select a category</option>
              {categoryList.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
              <option value="custom">Add Category</option>
            </select>
            {isCustomCategory && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full dark:bg-black dark:text-white dark:border-gray-600 bg-gray-200 border border-gray-300 rounded-lg"
                style={{ padding: "12px", marginTop: "8px" }}
                placeholder="Enter custom category"
              />
            )}
          </div>

          <div className="mb-4">
            <label className="text-lg font-semibold">Monthly Limit</label>
            <input
              type="number"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              className="w-full dark:bg-black dark:text-white dark:border-gray-600 bg-gray-200 border border-gray-300 rounded-lg"
              style={{ padding: "12px", marginTop: "8px" }}
              placeholder="Enter budget limit"
              min="1"
            />
          </div>

          <div className="mb-4">
            <label className="text-lg font-semibold">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full dark:bg-black dark:text-white dark:border-gray-600 bg-gray-200 border border-gray-300 rounded-lg"
              style={{ padding: "12px", marginTop: "8px" }}
            >
              {[...Array(5)].map((_, i) => (
                <option key={currentYear + i} value={currentYear + i}>{currentYear + i}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="text-lg font-semibold">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full dark:bg-black dark:text-white dark:border-gray-600 bg-gray-200 border border-gray-300 rounded-lg"
              style={{ padding: "12px", marginTop: "8px" }}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1} disabled={year === currentYear && i + 1 < currentMonth}>
                  {new Date(0, i).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full text-white font-semibold rounded-lg border-none transition-all ease-in-out bg-gradient-to-r from-purple-700 to-red-600"
            style={{ padding: "14px", fontSize: "18px", marginTop: "16px" }}
          >
            {isSettingBudget ? "Loading..." : "Set Budget"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MakeBudget;
