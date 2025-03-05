import Budget from "../models/Budget.model.js";
import Category from "../models/Category.model.js";
import moment from "moment";
import Transaction from "../models/Transaction.model.js";

async function getUserCategories(userId) {
    const existingCategories = await Category.find({ userId }).lean();
    
    if (existingCategories.length === 0) {
        // Insert default categories for this userId
        const defaultCategories = DEFAULT_CATEGORIES.map(name => ({ userId, name }));
        await Category.insertMany(defaultCategories);

        // Fetch and return the newly inserted categories as full objects
        return await Category.find({ userId }).lean();
    }

    return existingCategories; // Return full objects
}

// ✅ Express Route Handler
const getUserCategoriesHandler = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const categories = await getUserCategories(userId);
        return res.json({ success: true, categories }); 
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const addCategory = async(req,res)=>{
    try {
        const {name , userId} = req.body;
        if(!name || !userId) return res.status(400).json({error : "All fields are required"});

        const category = new Category({name , userId});
        await category.save();

        return res.status(201).json({message : "Category added", category});
    } catch (error) {
        return res.status(500).json({error : "Server error"});
    }
}

const deleteCategory = async(req,res)=>{
    try {
        const {categoryId} = req.params;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if(!deletedCategory) return res.status(404).json({error : "Category not found"});

        return res.json({message : "Category deleted"});
    } catch (error) {
        return res.status(500).json({error : "Server error"});
    }
}



const getCategoriesWithTotalSpent = async (req, res) => {
    try {
        const { userId } = req.params; // Extract userId from request params

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const now = new Date();
        const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based
        const currentYear = now.getFullYear();

        // Aggregate transactions for this user in the current month
        const expenses = await Transaction.aggregate([
            {
                $match: {
                    userId,
                    date: {
                        $gte: new Date(currentYear, currentMonth - 1, 1),
                        $lt: new Date(currentYear, currentMonth, 1),
                    },
                },
            },
            {
                $group: {
                    _id: "$category",
                    totalSpent: { $sum: "$amount" },
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            { $unwind: "$categoryDetails" },
            {
                $project: {
                    _id: 0,
                    categoryId: "$categoryDetails._id",
                    name: "$categoryDetails.name",
                    totalSpent: 1,
                },
            },
        ]);

        return res.json({ success: true, categories: expenses });
    } catch (error) {
        console.error("Error fetching categories with total spent:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const getAllCategoriesByUserId = async (req, res) => {
    try {
        const {userId} = req.params;
        const categories = await Category.find({userId}).lean();
        return res.json({ success: true, categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



const addDefaultCategories = async(req,res)=>{
    try {
        const DEFAULT_CATEGORIES = [
            "Food", 
            "Rent", 
            "Entertainment", 
            "Transport", 
            "Health", 
            "Utilities", 
            "Education", 
            "Shopping", 
            "Savings", 
            "Technology"
          ];
    
          const {userId} = req.params;
    
          const defaultCategories = DEFAULT_CATEGORIES.map(name => ({ userId, name }));
          await Category.insertMany(defaultCategories);
    
          return res.json({message : "Default categories added"});
    } catch (error) {
        return res.status(500).json({error : "Server error"});
    }
      
}



const getAllCategoriesWithBudget = async (req, res) => {
    try {
        const {userId} = req.params;
        const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based
        const currentYear = new Date().getFullYear();

        // Fetch categories
        const categories = await Category.find({ userId });
        
        // Fetch budgets filtered by user, month, and year
        const budgets = await Budget.find({
            userId,
            month: currentMonth,
            year: currentYear
        });
        
        // Fetch transactions filtered by user, month, and year
        const transactions = await Transaction.find({
            userId,
            month: currentMonth,
            year: currentYear
        });

        
        // i want to put the monthlylimit of specific specific category that is in the budget ={monthlyLimit : 9000 , category : "cate._id" } and also wanna put the spentmoney for that category that is there in the transaction ( by adding all the spend money of that category)

        const categoriesWithBudget = categories.map((category) => {
            const budget = budgets.find((budget) => budget.category.toString() === category._id.toString());

            

            
            const totalSpent = transactions.reduce((total, transaction) => {
                if (transaction.category.toString() === category._id.toString()) {
                    return total + transaction.amount;
                }
                return total;
            }, 0);
            return {
                _id: category._id,
                name: category.name,
                monthlyLimit: budget ? budget.monthlyLimit : 0,
                totalSpent,
            };
        });

        return res.json({ success: true, categories: categoriesWithBudget });
        

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const getBudgetVsActual = async (req, res) => {
    try {
      const { userId, year, month } = req.body;
      
  
      if (!userId || !year || !month) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
  
      // Ensure month is zero-padded
      const formattedMonth = String(month).padStart(2, "0");
      
      // Create a properly formatted date (first day of the month)
      const formattedDate = `${year}-${formattedMonth}-01`;
  
      // Validate date using moment
      const validDate = moment(formattedDate, "YYYY-MM-DD", true);
      if (!validDate.isValid()) {
        return res.status(400).json({ error: "Invalid date format" });
      }
  
      // Fetch budgets for the specified month & year
      const budgets = await Budget.find({ userId, year, month }).populate('category');
      const transactions = await Transaction.find({
        userId,
        createdAt: {
          $gte: moment(`${year}-${month}-01`, "YYYY-MM-DD").startOf("month").toDate(),
          $lte: moment(`${year}-${month}-01`, "YYYY-MM-DD").endOf("month").toDate(),
        },
      });
      
      // Map budget categories with spent amounts
      const budgetVsActual = budgets.map((budget) => {
        const spentAmount = transactions
          .filter((txn) => txn.category && budget?.category && txn.category.toString() === budget?.category._id.toString())
          .reduce((sum, txn) =>{
            
            if(txn.amount < 0) return sum + (txn.amount * -1);
            else return sum; // Add the absolute value of negative amountstxn.amount;
          } , 0); //
          
          
  
        return {
          category: budget.category.name,
          budgetAmount: budget.monthlyLimit, // Budgeted amount
          spent: spentAmount, // Actual spent amount
        };
      });
  
      res.status(200).json(budgetVsActual);
    } catch (error) {
      console.error("Error fetching budget vs actual data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  


// ✅ Export the handler
export { getUserCategoriesHandler , addCategory , deleteCategory , getCategoriesWithTotalSpent,getAllCategoriesByUserId  , addDefaultCategories , getAllCategoriesWithBudget , getBudgetVsActual};
