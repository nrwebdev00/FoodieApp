import express from 'express';

// Controllers
import {
  createRecipe,
  getRecipeCardSingle,
  getRecipeFullSingle,
  getAllRecipes,
  updateRecipe,
  deleteRecipe
} from '../../controllers/Recipes/RecipeController.js'

// Middleware
import { protectUserLogin, StaffUserAuth, AdminUserAuth } from '../../middleware/authMiddleware.js';
import advancedResults from '../../middleware/advanceResult.js';

// Models
import Recipe from '../../models/Recipes/RecipeModel.js';


const router = express.Router()

router.post('/', protectUserLogin, StaffUserAuth, createRecipe)
router.get('/', advancedResults(Recipe), getAllRecipes )
router.get('/card', getRecipeCardSingle)
router.get('/single', getRecipeFullSingle)
router.put('/', protectUserLogin, StaffUserAuth, updateRecipe)
router.delete('/', protectUserLogin, AdminUserAuth, deleteRecipe)


export default router