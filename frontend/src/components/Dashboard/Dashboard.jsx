import React, { useEffect, useState } from "react";
import { FaWallet, FaChartLine, FaArrowDown } from "react-icons/fa";
import Transactions from "./Transaction";
import Bargraph from "./Bargraph";
import StatsCard from "./StatsCard";
import axiosInstance from "../../axiosConfig/axiosConfig";
import {  useUser } from "../../utils/UserContext";
const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const {user } = useUser();
    const [totalBalance, setTotalBalance] = useState(0);
    const [expense, setExpense] = useState(0);
    const [salary, setSalary] = useState(0)

    const fetchTotalBalance = async()=>{
        try {
            const response = await axiosInstance.get(`/transaction/balance/${user}`);
            if(response.data){
                setTotalBalance(response.data.balance);
            }
        } catch (error) {
            console.log("error : " , error);
        }
    }

    const fetchMonthlyExpenses = async()=>{
        try {
            const response = await axiosInstance.get(`/transaction/expenses/${user}`);
            if(response.data){
                setExpense(response.data.expenses);
            }
        } catch (error) {
            console.log("error : " , error);
        }
    }


    const fetchMonthlySalary = async()=>{
        try {
            const response = await axiosInstance.get(`/transaction/income/${user}`);
            if(response.data){
                setSalary(response.data.income);
            }
        } catch (error) {
            console.log("error : " , error);
        }
    }

    const fetchData= async()=>{
        try {
            setIsLoading(true);
            if(user){
            
                await fetchTotalBalance();
                await fetchMonthlyExpenses();
                await fetchMonthlySalary();
            }
        } catch (error) {
            console.log("error : " , error);
        }finally{
            setIsLoading(false);
        }

    }


    useEffect(() => {  
        fetchData();
    }, [user])


    
    
    
  return (
    <>
      <div className="flex flex-wrap gap-5 justify-center p-5">
        <StatsCard
            loading={isLoading}
            title="Balance"
            amount={totalBalance.toString()}
            icon={<FaWallet />}
            bgColor="bg-purple-900 dark:bg-purple-950"
            textColor="text-gray-200 dark:text-gray-300"
            amountColor="text-gray-100 dark:text-gray-200"
        />
        <StatsCard
            loading={isLoading}
            title="Income (this month)"
            amount={salary.toString()}
            icon={<FaChartLine />}
            bgColor="bg-green-900 dark:bg-green-950"
            textColor="text-gray-200 dark:text-gray-300"
            amountColor="text-green-500"
        />
        <StatsCard
            loading={isLoading}
            title="Expenses (this month)"
            amount={expense.toString()}
            icon={<FaArrowDown />}
            bgColor="bg-red-900 dark:bg-red-950"
            textColor="text-gray-200 dark:text-gray-300"
            amountColor="text-red-500"
        />
      </div>

      <Bargraph />

      <Transactions />
    </>
  );
};

export default Dashboard;
