import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // UUID to separate users
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    monthlyLimit: { type: Number, required: true },
    month: { type: Number, required: true }, // 1-12 (Jan-Dec)
    year: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
const Budget = mongoose.model("Budget", budgetSchema);
export default Budget;