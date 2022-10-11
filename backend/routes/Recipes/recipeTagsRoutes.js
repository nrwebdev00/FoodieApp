import express from 'express';

// Controllers
import { createRecipeTags, getAllRecipeTags, deleteRecipeTags } from '../../controllers/Recipes/RecipeTagsController.js';

// Middleware
import { protectUserLogin, StaffUserAuth } from '../../middleware/authMiddleware.js'
import advancedResults from '../../middleware/advanceResult.js';

// Models
import RecipeTags from '../../models/Recipes/RecipeTagsModel.js';

const router = express.Router();

router.post('/', protectUserLogin, StaffUserAuth, createRecipeTags)
router.get('/', advancedResults(RecipeTags), getAllRecipeTags)
router.delete('/', protectUserLogin, StaffUserAuth, deleteRecipeTags)


export default router