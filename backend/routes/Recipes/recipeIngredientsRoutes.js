import express from 'express';

// Controllers
import {
  createRecipeIngredient,
  getRecipeIngredients,
  updateRecipeIngredients,
  deleteRecipeIngredients
} from '../../controllers/Recipes/RecipeIngredientsController.js';

// Middleware
import { protectUserLogin, StaffUserAuth } from '../../middleware/authMiddleware.js';
import advancedResults from '../../middleware/advanceResult.js';

// Models
import RecipeIngredients from '../../models/Recipes/RecipeIngredientsModel.js';

const router = express.Router()

router.post('/', protectUserLogin, StaffUserAuth, createRecipeIngredient)
router.get('/', advancedResults(RecipeIngredients), getRecipeIngredients )
router.put('/', protectUserLogin, StaffUserAuth, updateRecipeIngredients)
router.delete('/', protectUserLogin, StaffUserAuth, deleteRecipeIngredients)

export default router