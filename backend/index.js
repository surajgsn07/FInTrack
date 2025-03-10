import express from "express"
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: "https://fin-track-gsn.netlify.app",  // ✅ Correct Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // ✅ Add allowed headers
    credentials: true  // ✅ Required for cookies/session-based auth
}));
const PORT =  process.env.PORT || 8000 
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