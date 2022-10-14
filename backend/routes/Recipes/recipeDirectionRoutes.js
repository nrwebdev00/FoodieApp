import express from 'express';

// Controllers
import{
  createRecipeDirection,
  getRecipeDirection,
  updateRecipeDirection,
  deleteRecipeDirection
} from '../../controllers/Recipes/RecipeDirectionsController.js';

// Middleware
import { protectUserLogin, StaffUserAuth } from '../../middleware/authMiddleware.js';
import advancedResults from '../../middleware/advanceResult.js';

// Models
import RecipeDirections from '../../models/Recipes/RecipeDirectionsModel.js';

const router = express.Router()

router.post('/', protectUserLogin, StaffUserAuth, createRecipeDirection)
router.get('/', advancedResults(RecipeDirections), getRecipeDirection )
router.put('/', protectUserLogin, StaffUserAuth, updateRecipeDirection)
router.delete('/', protectUserLogin, StaffUserAuth, deleteRecipeDirection)

export default router