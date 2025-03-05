import React, { useState } from "react";
import { 
  FaBars, FaTimes, FaMoneyBillWave, 
  FaClipboardList, FaWallet, FaCog, FaHome ,FaPlusCircle,FaExchangeAlt,FaChartPie
} from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router-dom";
import Header from "../Header";
import { ToastContainer } from "react-toastify";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { title: "Transactions", path: "/dashboard/transactions", icon: <FaMoneyBillWave /> },
    { title: "Make Transaction", path: "/dashboard/make-transaction", icon: <FaExchangeAlt /> },
    { title: "Analytics", path: "/dashboard/analytics", icon: <FaClipboardList /> },
    { title: "Budget", path: "/dashboard/budget", icon: <FaWallet /> },
    { title: "Make Budget", path: "/dashboard/make-budget", icon: <FaChartPie /> },
    { title: "Budget vs Actual", path: "/dashboard/comparison", icon: <FaChartPie /> }
  ];
  
  return (
    <>
    <Header/>
    
    <ToastContainer />
    <div className="flex min-h-screen">
      {/* Sidebar for large screens */}
      <div
        className={`fixed lg:static bg-white dark:bg-black text-black dark:text-white 
        lg:w-64 w-64 min-h-screen shadow-xl transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{ padding: "20px" }} // Inline padding fix
      >
        
        <ul className="space-y-3 z-30">
  {menuItems.map((item, index) => (
    <li key={index} style={{ marginBottom: "12px" }}>
      <Link
        to={item.path}
        className={`flex items-center gap-4 rounded-md 
          transition-all duration-200 ease-in-out 
          text-gray-600 dark:text-gray-400 
          hover:bg-gray-200 dark:hover:bg-gray-800`}
        style={{
          padding: "12px 16px",
          backgroundColor: location.pathname === item.path ? "#d1d5db" : "transparent",
          color: location.pathname === item.path ? "#9333ea" : "#4b5563",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#e5e7eb";
          e.currentTarget.style.color = "#374151";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = location.pathname === item.path ? "#d1d5db" : "transparent";
          e.currentTarget.style.color = location.pathname === item.path ? "#9333ea" : "#4b5563";
        }}
      >
        <span className="text-lg">{item.icon}</span>
        <span>{item.title}</span>
      </Link>
    </li>
  ))}
</ul>


      </div>

      {/* Toggle button for mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-black dark:text-white bg-white dark:bg-black p-3 rounded-md shadow-md"
        >
          {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
        </button>
      </div>


      
      {/* Main Content */}
      <div
        className="flex-grow p-5 bg-white dark:bg-black text-black dark:text-white"
        style={{ padding: "20px" }} // Inline padding fix
      >
        <Outlet/>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
