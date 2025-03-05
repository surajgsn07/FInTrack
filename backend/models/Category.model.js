import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    userId: { type: String, required: true }, // UUID to separate users
    name: { type: String, required: true }, // e.g., "Food", "Rent"
    createdAt: { type: Date, default: Date.now },
  });

  const Category  =  mongoose.model("Category", categorySchema);
  export default Category;
  