import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import axiosInstance from "../../axiosConfig/axiosConfig";
import { useUser } from "../../utils/UserContext";
import BudgetModal from "./CreateBudgetModal";

import { BiLoaderCircle } from "react-icons/bi";

const Budget = () => {
  const { user } = useUser();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setselectedCategory] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  console.log({ categories });
  const onClose = () => {
    setselectedCategory(null);
  };

  const onSuccess = () => {
    fetchCategoriesWithBudget();
  };

  const fetchCategoriesWithBudget = async () => {
    setisLoading(true);
    try {
      const response = await axiosInstance.get(`/category/budget/${user}`);
      if (response.data) {
        console.log("budget:", response.data);
        response.data.categories = response.data.categories.map((category) => ({
          ...category,
          color: `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
          )}, ${Math.floor(Math.random() * 256)})`,
        }));

        

        setCategories(response.data.categories);
      }
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCategoriesWithBudget();
  }, [user]);

  if (isLoading) {
    <>
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: "16px" }}
      >
        <h2 className="text-xl md:text-2xl font-semibold">Budget</h2>
        <span className="text-gray-400 text-sm md:text-base">
          {new Date().toLocaleString("en", { month: "long", year: "numeric" })}
        </span>
      </div>

      <div className="flex justify-center w-full">
        <BiLoaderCircle size={30} className="animate-spin" />
      </div>
    </>;
  }

  return (
    <div
      className="w-full mx-auto rounded-lg shadow-lg"
      style={{ padding: "24px", backgroundColor: "var(--bg-color)" }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: "16px" }}
      >
        <h2 className="text-xl md:text-2xl font-semibold">Budget</h2>
        <span className="text-gray-400 text-sm md:text-base">
          {new Date().toLocaleString("en", { month: "long", year: "numeric" })}
        </span>
      </div>

      {/* Categories List */}
      {categories.map((category, index) => {
        const progress = category.budget
          ? Math.min((category.totalSpent / category.monthlyLimit) * 100, 100)
          : 0;

        return (
          <div
            key={index}
            className="rounded-lg shadow-sm"
            style={{
              marginBottom: "12px",
              padding: "16px",
              backgroundColor: "var(--card-bg)",
            }}
          >
            {/* Category Name & Edit Icon */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span
                  style={{ backgroundColor: category.color }}
                  className={`w-3 h-3 md:w-4 md:h-4  rounded-full`}
                ></span>
                <h3 className="text-lg md:text-xl font-medium">
                  {category.name}
                </h3>
              </div>
              <Pencil
                onClick={() => setselectedCategory(category)}
                size={18}
                className="text-gray-400 cursor-pointer"
              />
            </div>

            {/* Budget Info */}
            {category.monthlyLimit !== 0 ? (
              <>
                <p className="text-gray-400 text-sm md:text-base mt-1">
                  Rs.{category.totalSpent.toFixed(2)} of Rs.
                  {category.monthlyLimit.toFixed(2)}
                </p>
                <div className="w-full bg-gray-300 dark:bg-gray-800 h-2 md:h-3 rounded-full mt-2">
                  <div
                    className="h-2 md:h-3 rounded-full bg-white"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-xs md:text-sm text-gray-400 mt-1">
                  {Math.round(progress)}%
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-sm md:text-base mt-1">
                No budget set
              </p>
            )}
          </div>
        );
      })}

      {selectedCategory && (
        <BudgetModal
          category={selectedCategory.name}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
};

export default Budget;
