import asyncHandler from "express-async-handler";

// Models
import Recipe from '../../models/Recipes/RecipeModel.js';
import RecipeIngredients from '../../models/Recipes/RecipeIngredientsModel.js';

// Utlis
import ErrorHandler from "../../utlis/errorHandler.js";

// @desc Create Recipe Ingredient
// @route POST /api/recipeIngredient
// @access PRIVATE - LOGIN, STAFF, ADMIN
const createRecipeIngredient = asyncHandler(async(req, res, next) =>{
  const recipe = await Recipe.findById(req.body.recipeId)
  const { ingredientName, ingredientAmount, ingredientMeasureBy } = req.body;

  if(!recipe){
    return next(new ErrorHandler('Recipe Not Found', 401))
  }

  if(!ingredientName || !ingredientMeasureBy || !ingredientAmount){
    return next(new ErrorHandler('Invalid Ingredient to Add'), 400)
  }

  const recipeIngredient = await RecipeIngredients.create({
    recipe: req.body.recipeId,
    ingredientName: JSON.parse(JSON.stringify(ingredientName).toLowerCase()),
    ingredientAmount,
    ingredientMeasureBy
  })

  if(!recipeIngredient){
    return next(new ErrorHandler('Recipe Ingredient Not Add.', 500))
  }

  recipe.ingredients.push(recipeIngredient)
  recipe.save({ validateBeforeSave: false })


  res.status(200).json({
    success: true,
    data: recipeIngredient
  })
  next()
})

// @desc Get All Recipe Ingredients for a Recipe
// @route GET /api/recipeIngredient
// @access PUBLIC
const getRecipeIngredients = asyncHandler(async(req, res, next) =>{
  res.status(200).json(res.advancedResults)
})

// @desc Update Recipe Ingredients
// @route PUT /api/recipeIngredient
// @access PRIVATE - LOGIN, STAFF, ADMIN
const updateRecipeIngredients = asyncHandler(async(req, res, next) =>{
  const recipeIngredient = await RecipeIngredients.findById(req.body.recipeIngredientId)
  const { ingredientName, ingredientAmount, ingredientMeasureBy } = req.body;

  if(!recipeIngredient){
    return next(new ErrorHandler('Recipe Ingredient Not Found', 400))
  }
  const recipe = await Recipe.findById(recipeIngredient.recipe)

  recipeIngredient.ingredientName = JSON.parse(JSON.stringify(ingredientName).toLowerCase()) || recipeIngredient.ingredientName
  recipeIngredient.ingredientAmount = ingredientAmount || recipeIngredient.ingredientAmount
  recipeIngredient.ingredientMeasureBy = ingredientMeasureBy || recipeIngredient.ingredientMeasureBy

  const updatedRecipeIngredient = await recipeIngredient.save()

  if(!updatedRecipeIngredient){
    return next(new ErrorHandler('Unable to Update Recipe Ingredient', 500))
  }

  const newRecipeIngredients = await RecipeIngredients.find({ recipe: recipe._id})
  recipe.ingredients = []
  for(let i = 0; i < newRecipeIngredients.length; i++){
    recipe.ingredients.push(newRecipeIngredients[i])
  }
  recipe.save({ validateBeforeSave: false})

  res.status(200).json({
    success: true,
    data: updatedRecipeIngredient
  })
  next()
})

// @desc Delete Recipe Ingredients
// @route DELETE /api/recipeIngredient
// @access PRIVATE - LOGIN, STAFF, ADMIN
const deleteRecipeIngredients = asyncHandler(async(req, res, next) =>{
  const recipeIngredient = await RecipeIngredients.findById(req.body.recipeIngredientId)

  if(!recipeIngredient){
    return next(new ErrorHandler('Recipe Ingredient Not Found', 400))
  }

  const recipe = await Recipe.findById(recipeIngredient.recipe)
  await RecipeIngredients.findByIdAndDelete(req.body.recipeIngredientId)

  const newRecipeIngredients = await RecipeIngredients.find({ recipe: recipe._id})
  recipe.ingredients = []
  for(let i = 0; i < newRecipeIngredients.length; i++){
    recipe.ingredients.push(newRecipeIngredients[i])
  }
  recipe.save({ validateBeforeSave: false})

  res.status(200).json({
    success: true,
    message: 'Recipe Ingredient Deleted'
  })

})

export {
  createRecipeIngredient,
  getRecipeIngredients,
  updateRecipeIngredients,
  deleteRecipeIngredients
}