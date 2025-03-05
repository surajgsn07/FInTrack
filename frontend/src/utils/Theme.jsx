import { useEffect, useState } from "react";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
const ThemeToggle = () => {
  // Check localStorage or system preference
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  const [theme, setTheme] = useState(storedTheme || (prefersDark ? "dark" : "light"));

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-4 cursor-pointer bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded"
    >
      {theme === "dark" ? <MdDarkMode size={25}/> : <MdLightMode size={25} />}
    </button>
  );
};

export default ThemeToggle;
