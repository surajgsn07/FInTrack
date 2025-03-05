import {Router} from "express"
import { addDefaultCategories, getAllCategoriesByUserId, getAllCategoriesWithBudget, getBudgetVsActual } from "../controllers/category.controller.js";

const router = Router();

router.get('/all/:userId' , getAllCategoriesByUserId);
router.post('/add-default/:userId' , addDefaultCategories);
router.get('/budget/:userId' , getAllCategoriesWithBudget)
router.post('/comparison' , getBudgetVsActual)
export default router;