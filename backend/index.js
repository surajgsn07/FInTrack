import express from "express"
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin : "http://localhost:5173",
    methods:['GET' , 'POST' , 'PUT' , 'DELETE'],
    credentials:true
}))
const PORT = 8000
connectDB();

import transactionRouter from "./routes/transaction.routes.js"
import categoryRouter from "./routes/category.routes.js"
import budgetRouter from "./routes/budget.routes.js"
app.use('/transaction' , transactionRouter);
app.use('/category' , categoryRouter);
app.use('/budget' , budgetRouter);



app.listen(PORT , ()=>{
    console.log(`Server running at port ${PORT}`)
})