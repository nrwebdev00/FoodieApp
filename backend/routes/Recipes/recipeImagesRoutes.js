import express from 'express';

// Controllers
import {
  createRecipeImage,
  getAllRecipeImage,
  getRecipeImage,
  deleteRecipeImage
 } from '../../controllers/Recipes/RecipeImagesController.js';

// MiddleWare
import { protectUserLogin, StaffUserAuth } from '../../middleware/authMiddleware.js';
import advancedResults from '../../middleware/advanceResult.js';

// Models
import RecipeImages from '../../models/Recipes/RecipeImagesModel.js';

const router = express.Router()

router.post('/', protectUserLogin, StaffUserAuth, createRecipeImage)
router.get('/single/:id', getRecipeImage)
router.get('/', advancedResults(RecipeImages), getAllRecipeImage)
router.delete('/', protectUserLogin, StaffUserAuth, deleteRecipeImage)

export default router