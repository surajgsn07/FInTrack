import express from "express";
import {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getMonthlyExpenses,
    getUserBalance,
    getMonthlyIncome,
    getMonthlyTransactions,
    getMonthlyReport
    
} from "../controllers/transaction.controller.js";

const router = express.Router();


router.post("/add", addTransaction); // Add a new transaction
router.get("/all/:userId", getTransactions); // Get all transactions for a user
router.put("/update/:transactionId", updateTransaction); // Update a transaction
router.delete("/delete/:transactionId", deleteTransaction); // Delete a transaction

// Routes for financial summaries
router.get("/balance/:userId", getUserBalance); // Get user balance
router.get("/income/:userId", getMonthlyIncome); // Get income for the current month
router.get("/expenses/:userId", getMonthlyExpenses); // Get expenses for the current month
router.get("/monthly-transactions/:userId", getMonthlyTransactions); // Get transactions for the current month
router.post("/report" , getMonthlyReport);

export default router;
