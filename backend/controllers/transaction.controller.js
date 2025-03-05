import Category from "../models/Category.model.js";
import Transaction from "../models/Transaction.model.js";
import moment from "moment";

// ✅ Add a new transaction
const addTransaction = async (req, res) => {
  try {
    const { userId, amount, description  , category} = req.body;


    if (!userId || !amount) {
      return res.status(400).json({ error: "User ID and amount are required" });
    }

    let cat = null;
    if(category){
      cat = await Category.findOne({name : category , userId});
      if(!cat){
        const newCategory = await Category.create({name : category , userId});
        cat = newCategory;
      }
      

      const date = new Date(); // Set to current date

      const transaction = new Transaction({ userId, amount, date, description , category : cat._id});
      await transaction.save();
      
      res.status(201).json({ message: "Transaction added successfully", transaction });

    }else{
      const date = new Date(); // Set to current date

      const transaction = new Transaction({ userId, amount, date, description });
      
      res.status(201).json({ message: "Transaction added successfully", transaction });
      await transaction.save();
    }

  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// ✅ Get all transactions for a user
const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const transactions = await Transaction.find({ userId }).sort({ date: -1 }).populate('category');

    res.json({ transactions : transactions });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { amount, date, description } = req.body;

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { amount, date, description },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ message: "Transaction updated", transaction: updatedTransaction });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);

    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getUserBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const transactions = await Transaction.find({ userId });
    console.log({transactions})
    if(transactions.length === 0) return res.status(200).json({balance: 0});

    const balance = transactions.reduce((acc, txn) => acc + txn.amount, 0);

    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get Income for the Current Month
const getMonthlyIncome = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const income = await Transaction.aggregate([
      {
        $match: {
          userId, // UUID remains a string, no need for ObjectId
          amount: { $gt: 0 }, // Only positive values (income)
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
        },
      },
    ]);

    res.json({ income: income[0]?.totalIncome || 0 });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get Expenses for the Current Month
const getMonthlyExpenses = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const expenses = await Transaction.aggregate([
      {
        $match: {
          userId, // UUID remains a string
          amount: { $lt: 0 }, // Only negative values (expenses)
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: "$amount" },
        },
      },
    ]);

    res.json({ expenses: Math.abs(expenses[0]?.totalExpenses || 0) });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get Monthly Transactions (Separate Added & Expenditure)
const getMonthlyTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const startOfYear = moment().startOf("year").toDate();
    const endOfYear = moment().endOf("year").toDate();

    const transactions = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          added: { $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] } }, // Sum only positive amounts
          expenditure: { $sum: { $cond: [{ $lt: ["$amount", 0] }, "$amount", 0] } }, // Sum only negative amounts
        },
      },
      { $sort: { "_id": 1 } }
    ]);

    // Format the response for the frontend
    const monthlyData = Array.from({ length: 12 }, (_, index) => ({
      month: moment().month(index).format("MMM"), // Converts index to month name
      added: transactions.find((txn) => txn._id === index + 1)?.added || 0,
      expenditure: Math.abs(transactions.find((txn) => txn._id === index + 1)?.expenditure || 0), // Convert to positive value
    }));

    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


// ✅ Get Monthly Report (Income, Expenses, Category-wise, Daily Breakdown)
const getMonthlyReport = async (req, res) => {
  try {
    const { userId, year, month } = req.body;

    if (!userId || !year || !month) {
      return res.status(400).json({ error: "User ID, year, and month are required" });
    }

    // Convert year & month to Date Range
    const startOfMonth = moment(`${year}-${month}-01`).startOf("month").toDate();
    const endOfMonth = moment(`${year}-${month}-01`).endOf("month").toDate();

    // Aggregate Query
    const transactions = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] } },
          totalExpenses: { $sum: { $cond: [{ $lt: ["$amount", 0] }, "$amount", 0] } },
        },
      },
    ]);

    // **Category-wise spending**
    const categoryWiseSpending = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
          amount: { $lt: 0 }, // Only consider expenses
        },
      },
      {
        $group: {
          _id: "$category", // This contains ObjectId referencing Category
          totalSpent: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories", // Collection name should match MongoDB's auto-naming (lowercase + plural)
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: {
          path: "$categoryInfo",
          preserveNullAndEmptyArrays: true, // If category is missing, still include the data
        },
      },
      {
        $project: {
          _id: 0,
          category: { $ifNull: ["$categoryInfo.name", "Other"] }, // Use "Unknown" if category is missing
          totalSpent: 1,
        },
      },
    ]);
    
    
    

    // **Daily spending breakdown**
    const dailySpending = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$date" },
          totalSpent: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format the response
    res.json({
      totalIncome: transactions[0]?.totalIncome || 0,
      totalExpenses: Math.abs(transactions[0]?.totalExpenses || 0), // Convert to positive value
      categoryWiseSpending: categoryWiseSpending.map((cat) => ({
        category: cat.category,
        amount: Math.abs(cat.totalSpent),
      })),
      dailySpending: dailySpending.map((day) => ({
        day: day._id,
        amount: day.totalSpent,
      })),
    });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};




export {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getMonthlyExpenses,
    getUserBalance,
    getMonthlyIncome,
    getMonthlyTransactions,
    getMonthlyReport
}