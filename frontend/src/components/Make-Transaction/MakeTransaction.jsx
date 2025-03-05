import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig/axiosConfig";
import { useUser } from "../../utils/UserContext";
import { toast } from "react-toastify";

const MakeTransaction = () => {
  const [transactionType, setTransactionType] = useState("Income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const {user } = useUser()
  const [categoryList, setcategoryList] = useState([])
  const [isLoading, setisLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories=async()=>{
    try {
      setisLoading(true)
        const response = await axiosInstance.get(`/category/all/${user}`);
        if(response.data){
            console.log("data : " , response.data);
            setcategoryList(response.data.categories);
        }
    } catch (error) {
        console.log("error : " , error)
    }finally{
      setisLoading(false);
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }
    if (description.length < 1 || description.length > 50) {
      alert("Description must be between 1 and 50 characters");
      return;
    }



    
    const finalCategory = isCustomCategory ? customCategory : category;
    
    try {
      setIsSubmitting(true);
        const response = await axiosInstance.post('/transaction/add' ,{
            userId : user,
            amount : transactionType === 'Income' ? amount : ((-1)*amount),
            description,
            category:finalCategory
        } )

        toast.success("Transaction added successfully!");
        if(response.data){
            setAmount("");
            setDescription("");
            setDate(new Date().toISOString().split("T")[0]);
            setCategory("");
            setCustomCategory("");
            setIsCustomCategory(false);
        }
    } catch (error) {
        console.log("error : " , error)
        toast.error("Error adding transaction");
    }finally{
      setIsSubmitting(false);
    }

  };
  
  useEffect(() => {
    if(user)
        fetchCategories();
  }, [user])

  if(isLoading){
    return <div className="flex items-center justify-center min-h-screen w-full bg-gray-100 dark:bg-black dark:text-white">
      <div className="bg-white dark:bg-[#121212] shadow-lg rounded-xl w-full max-w-md" style={{ padding: "24px" }}>
        <h2 className="text-center text-2xl font-bold mb-5">Loading...</h2>
      </div>
    </div>
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100 dark:bg-black dark:text-white">
      <div className="bg-white dark:bg-[#121212] shadow-lg rounded-xl w-full max-w-md" style={{ padding: "24px" }}>
        <h2 className="text-center text-2xl font-bold mb-5">Add Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1">
              <label className="text-lg font-semibold">Transaction Type</label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-full dark:bg-black dark:text-white dark:border-gray-600 bg-gray-200 border border-gray-300 rounded-lg"
                style={{ padding: "12px", marginTop: "8px" }}
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-lg font-semibold">Amount</label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-200 dark:bg-black" style={{ padding: "12px", marginTop: "8px" }}>
                <span className="mr-2">Rs.</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent border-none outline-none dark:text-white"
                  placeholder="0.00"
                  min="1"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-lg font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full dark:bg-black dark:text-white dark:border-gray-600 bg-gray-200 border border-gray-300 rounded-lg"
              style={{ padding: "12px", marginTop: "8px" }}
              placeholder="What was this transaction for?"
              maxLength="50"
              rows="3"
            ></textarea>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            
            <div className="flex-1">
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
                {categoryList.map((cat)=>(
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
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer text-white font-semibold rounded-lg border-none transition-all ease-in-out bg-gradient-to-r from-purple-700 to-red-600"
            style={{ padding: "14px", fontSize: "18px", marginTop: "16px" }}
          >
            {isSubmitting ? "Loading..." : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MakeTransaction;