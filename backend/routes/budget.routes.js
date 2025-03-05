import {Router} from "express"
import { createBudget } from "../controllers/budget.controller.js";
const router = Router();


router.post("/create" , createBudget);

export default router;
