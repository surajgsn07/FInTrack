import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import { UserProvider } from "./utils/UserContext.jsx";
import Transactions from "./components/Transactions/Transactions.jsx";
import Analytics from "./components/Analytics/Analytics.jsx";
import MakeTransaction from "./components/Make-Transaction/MakeTransaction.jsx";
import MakeBudget from "./components/Make-Budget/MakeBudget.jsx";
import Budget from "./components/Budget/Budget.jsx";
import HomePage from "./components/Home/LandingPage.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import BudgetVsActual from "./components/BudgetVsActualy/BudgetVsActual.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path:"",
        element:<HomePage/>
      }
    ],
  },{
    path: "/dashboard",
    element: <Sidebar />,
    children:[
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path:"transactions",
        element:<Transactions/>
      },{
        path:"analytics",
        element:<Analytics/>
      },{
        path:"make-transaction",
        element:<MakeTransaction/>
      },{
        path:"make-budget",
        element:<MakeBudget/>
      },{
        path:"budget",
        element:<Budget/>
      },{
        path:"comparison",
        element:<BudgetVsActual/>
      }
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
  </StrictMode>
);
