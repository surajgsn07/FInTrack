import Budget from "../models/Budget.model.js"
import Category from "../models/Category.model.js";

const createBudget = async (req, res) => {
    try {
        const { userId, category, monthlyLimit, month, year } = req.body;
        

        if (!userId || !category || !monthlyLimit || !month || !year) {
            return res.status(400).json({ error: "All fields are required" });
        }

        
        const categoryObj = await Category.findOne({name : category , userId});

        
        if (categoryObj) {
            const existingBudget = await Budget.findOne({ userId, category : categoryObj?._id, month, year });
            if(existingBudget){
                return res.status(400).json({ error: "Budget already exists" });
            }
            const budget = new Budget({ userId, category : categoryObj._id, monthlyLimit, month, year });
            await budget.save();

            res.status(201).json({ message: "Budget created", budget });
        }else{
            const cat = new Category({name : category , userId});
            
            cat.save();
            const budget = new Budget({ userId, category: cat._id, monthlyLimit, month, year });
            await budget.save();
            res.status(201).json({ message: "Budget created", budget });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

export {
    createBudget
}