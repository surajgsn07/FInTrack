import React from "react";
import ThemeToggle from "../utils/Theme";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div style={{padding:"10px"}} className="flex h-12 items-center justify-between m-5 px-5 bg-white text-black dark:bg-black dark:text-white shadow-lg">
      <Link to={"/"} className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text ">
        FinTrack
      </Link>
      <ThemeToggle />
    </div>
  );
};

export default Header;
