import asyncHandler from 'express-async-handler';

// Models
import Recipe from '../../models/Recipes/RecipeModel.js';
import RecipeTags from '../../models/Recipes/RecipeTagsModel.js';
import RecipeIngredients from '../../models/Recipes/RecipeIngredientsModel.js';
import RecipeDirections from '../../models/Recipes/RecipeDirectionsModel.js';
import RecipeImages from '../../models/Recipes/RecipeImagesModel.js';

// Utlis
import ErrorHandler from '../../utlis/errorHandler.js';


// @desc Create Recipe
// @route POST /api/recipe
// @access PRIVATE - LOGIN
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
    return next(new ErrorHandler('Recipe Not Found', 400))
  }

  if(!recipe.isPublicApproved){
    return next(new ErrorHandler('Recipe Not Approved for Public View', 401))
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
  const recipeTags = await RecipeTags.find({ recipe: req.body.recipeId })
  const recipeIngredient = await RecipeIngredients.find({ recipe: req.body.recipeId })
  const recipeDirection = await RecipeDirections.find({ recipe: req.body.recipeId })
  const recipeImages = await RecipeImages.find({ recipe: req.body.recipeId })
  let data = {};

  if(!recipe){
    return next(new ErrorHandler('Recipe Not Found', 400))
  }

  if(!recipe.isPublicApproved){
    return next(new ErrorHandler('Recipe Not Approved For Public View', 401))
  }

  data.recipe = recipe

  if(recipeTags){
    data.tags = recipeTags
  }

  if(recipeIngredient){
    data.ingredients = recipeIngredient
  }

  if(recipeDirection){
    data.direction = recipeDirection
  }

  if(recipeImages){
    data.images = recipeImages
  }

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

// @desc Admin or Staff Approve Public View

// @desc update Recipe
// @route PUT /api/recipe/
// @access PRIVATE - LOGIN STAFF, ADMIN
const updateRecipe = asyncHandler(async(req, res, next) =>{
  const recipe = await Recipe.findById(req.body.recipeId);
  const { title, desc, mainImage, isPublic } = req.body;

  if(!recipe){
    return next(new ErrorHandler('Recipe Not Found', 400))
  }

  recipe.title = title || recipe.title,
  recipe.desc = desc || recipe.desc,
  recipe.mainImage = mainImage || recipe.mainImage
  recipe.isPublic = isPublic || recipe.isPublic

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
  const recipeTags = await RecipeTags.find({ recipe: req.body.recipeId})
  const recipeIngredients = await RecipeIngredients.find({ recipe: req.body.recipeId })
  const recipeDirection = await RecipeDirections.find({ recipe: req.body.recipeId })
  const recipeImages = await RecipeImages.find({ recipe: req.body.recipeId })

  if(!recipe){
    return next(new ErrorHandler('Recipe Not Found', 400))
  }
  if(recipeTags.length !== 0){
    await RecipeTags.deleteMany({ recipe: req.body.recipeId })
  }

  if(recipeIngredients.length !== 0){
    await RecipeIngredients.deleteMany({ recipe: req.body.recipeId })
  }

  if(recipeDirection.length !== 0){
    await RecipeDirections.deleteMany({ recipe: req.body.recipeId })
  }

  if(recipeImages.length !== 0){
    await RecipeImages.deleteMany({ recipe: req.body.recipeId })
  }

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