import asyncHandler from 'express-async-handler';

// Models
import Recipe from '../../models/Recipes/RecipeModel.js';

// Utlis
import ErrorHandler from '../../utlis/errorHandler.js';

// @desc Create Recipe
// @route POST /api/recipe
// @access PRIVATE - LOGIN STAFF, ADMIN
const createRecipe = asyncHandler(async (req, res, next) =>{
  const recipe = await Recipe.create({
    user: req.user._id
  });

  if(!recipe){
    return next(new ErrorHandler('Unable to Create Recipe', 500));
  }

  res.status(200).json({
    success: true,
    data: recipe
  });
  next();
})

// @desc Get Recipe Card - Short Version
// @route GET /api/recipe/card
// @access PUBLIC
const getRecipeCardSingle = asyncHandler(async(req, res, next) =>{
  const recipe = await Recipe.findById( req.body.recipeId)

  if(!recipe){
    return next(new ErrorHandler('Recipe Not Found', 401))
  }

  res.status(200).json({
    success: true,
    data: recipe
  })
})

// @desc Get Recipe Full Version
// @route GET /api/recipe/single
// @access PUBLIC
const getRecipeFullSingle = asyncHandler(async(req, res, next) =>{
  const recipe = await Recipe.findById( req.body.recipeId)
  let data = {};

  if(!recipe){
    return next(new ErrorHandler('Recipe Not Found', 401))
  }

  data.recipe = recipe

  // TODO - Tags, Ingredients, Directions, Images - will add when crud completed

  res.status(200).json({
    success: true,
    data
  })

})

// @desc Get All Recipes Advance Results
// @route GET /api/recipe/
// @access PUBLIC
const getAllRecipes = asyncHandler(async(req, res, next) =>{
  res.status(200).json(res.advancedResults)
})

// @desc update Recipe
// @route PUT /api/recipe/
// @access PRIVATE - LOGIN STAFF, ADMIN
const updateRecipe = asyncHandler(async(req, res, next) =>{
  const recipe = await Recipe.findById(req.body.recipeId);
  const { title, desc, mainImage } = req.body;

  if(!recipe){
    return next(new ErrorHandler('Recipe Not Found', 400))
  }

  recipe.title = title || recipe.title,
  recipe.desc = desc || recipe.desc,
  recipe.mainImage = mainImage || recipe.mainImage

  const updatedRecipe = await recipe.save()

  if(!updateRecipe){
    return next(new ErrorHandler('Unable to update Recipe', 500))
  }

  res.status(200).json({
    success: true,
    data: updatedRecipe
  })

})

// @desc Delete Recipe
// @route DELETE /api/recipe
// @access PRIVATE - ADMIN ONLY
const deleteRecipe = asyncHandler(async(req, res, next) =>{
  const recipe = await Recipe.findById(req.body.recipeId)

  if(!recipe){
    return next(new ErrorHandler('Recipe Not Found', 400))
  }

  // TODO - delete Tags, Ingredients, Directions, Images of Recipe

  await Recipe.findByIdAndDelete(req.body.recipeId)

  res.status(200).json({
    success:true,
    message: 'Recipe Deleted'
  })
})



export {
  createRecipe,
  getRecipeCardSingle,
  getRecipeFullSingle,
  getAllRecipes,
  updateRecipe,
  deleteRecipe
}