import { Link } from "react-router-dom";

const HomePage = () => {
    return (
      <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
        
        {/* Hero Section */}
        <header className="text-center" style={{ padding: "60px 20px" }}>
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Track Your Finances, Effortlessly
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400" style={{ marginTop: "16px" , marginBottom:"16px" }}>
            Manage your daily expenses, set budgets, and gain insights.
          </p>
          <Link
            to={"/dashboard"} 
            style={{ padding: "12px 24px", marginTop: "24px" }}
            className="bg-gradient-to-r from-purple-400 to-pink-500 text-white font-semibold rounded-lg shadow-md"
          >
            Get Started
          </Link>
        </header>
  
        {/* Features Section */}
        <section 
          className="grid md:grid-cols-3 gap-6" 
          style={{ padding: "40px 20px", margin: "0 auto", maxWidth: "1200px" }}
        >
          <div className="bg-gray-100 dark:bg-black rounded-lg shadow-md text-center" style={{ padding: "24px" }}>
            <h3 className="text-xl font-semibold">Expense Tracking</h3>
            <p className="text-gray-600 dark:text-gray-400" style={{ marginTop: "8px" }}>
              Categorize and monitor your spending habits.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-black rounded-lg shadow-md text-center" style={{ padding: "24px" }}>
            <h3 className="text-xl font-semibold">Budget Planning</h3>
            <p className="text-gray-600 dark:text-gray-400" style={{ marginTop: "8px" }}>
              Set budgets and get notifications before exceeding limits.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-black rounded-lg shadow-md text-center" style={{ padding: "24px" }}>
            <h3 className="text-xl font-semibold">Smart Reports</h3>
            <p className="text-gray-600 dark:text-gray-400" style={{ marginTop: "8px" }}>
              Get real-time insights with charts and graphs.
            </p>
          </div>
        </section>
  
        {/* Footer */}
        <footer 
          className="text-center bg-gray-200 dark:bg-black" 
          style={{ padding: "20px", marginTop: "40px" }}
        >
          <p className="text-gray-600 dark:text-gray-400">© 2025 FinTrack. All rights reserved.</p>
        </footer>
      </div>
    );
  };
  
  export default HomePage;
  