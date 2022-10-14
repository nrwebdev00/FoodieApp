import asyncHandler from 'express-async-handler';

// Models
import RecipeDirections from '../../models/Recipes/RecipeDirectionsModel.js'
import Recipe from '../../models/Recipes/RecipeModel.js';

// Utlis
import ErrorHandler from '../../utlis/errorHandler.js';

// @desc Create Recipe Direction
// @route POST /api/recipeDirections
// @access PRIVATE - LOGIN STAFF, ADMIN
const createRecipeDirection = asyncHandler(async(req, res, next) =>{
  const { recipeId, stepNumber, stepDirection, detailDirection, timeToComplete } = req.body;
  const recipe = await Recipe.findById(recipeId)

  if(!recipe){
    return next(new ErrorHandler('Recipe Not Found', 400))
  }

  if(!stepNumber || !stepDirection ){
    return next(new ErrorHandler('Recipe Step Number or Direction not given', 400))
  }

  const checkIfExists = await RecipeDirections.find({
    recipe: recipeId,
    stepNumber,
    stepDirection: JSON.parse(JSON.stringify(stepDirection).toLowerCase())
  })

  if(checkIfExists.length !== 0){
    return next(new ErrorHandler('Recipe Direction Already Exists', 400))
  }

  const recipeDirection = await RecipeDirections.create({
    recipe: recipeId,
    stepNumber,
    stepDirection: JSON.parse(JSON.stringify(stepDirection).toLowerCase()),
    detailDirection,
    timeToComplete
  })

  if(!recipeDirection){
    return next(new ErrorHandler('Recipe Direction Not added', 500))
  }

  recipe.directions.push(recipeDirection)
  recipe.save({ validateBeforeSave: false })

  res.status(200).json({
    success: true,
    data: recipeDirection
  })
})

// @desc Get All Recipe Directions - Advanced Results
// @route GET /api/recipeDirections
// @access PUBLIC
const getRecipeDirection = asyncHandler(async(req, res, next) =>{
  res.status(200).json(res.advancedResults)
})

// @desc Update Recipe Direction
// @route PUT /api/recipeDirections
// @access PRIVATE - LOGIN STAFF, ADMIN
const updateRecipeDirection = asyncHandler(async(req, res, next) =>{
  const {
    recipeDirectionId,
    stepNumber,
    stepDirection,
    detailDirection,
    timeToComplete
  } = req.body;
  const recipeDirection = await RecipeDirections.findById(recipeDirectionId)

  if(!recipeDirection){
    return next(new ErrorHandler('Recipe Direction Not Found', 400))
  }

  const recipe = await Recipe.findById(recipeDirection.recipe)

  recipeDirection.stepNumber = stepNumber || recipeDirection.stepNumber
  recipeDirection.stepDirection = JSON.parse(JSON.stringify(stepDirection).toLowerCase()) || recipeDirection.stepDirection
  recipeDirection.detailDirection = detailDirection || recipeDirection.detailDirection
  recipeDirection.timeToComplete = timeToComplete || recipeDirection.timeToComplete

  const updatedRecipeDirection = await recipeDirection.save()

  const newRecipeDirections = await RecipeDirections.find({ recipe: recipe._id })
  recipe.directions = []
  for(let i = 0; i < newRecipeDirections.length; i++){
    recipe.directions.push(newRecipeDirections[i])
  }
  recipe.save({ validateBeforeSave: false })




  if(!updateRecipeDirection){
    return next(new ErrorHandler('Recipe Direction Not added', 500))
  }

  res.status(200).json({
    success: true,
    data: updatedRecipeDirection
  })
})

// @desc Delete Recipe Direction
// @route DELETE /api/recipeDirections
// @access PRIVATE - LOGIN STAFF, ADMIN
const deleteRecipeDirection = asyncHandler(async(req, res, next) =>{
  const recipeDirection = await RecipeDirections.findById(req.body.recipeDirectionId)

  if(!recipeDirection){
    return next(new ErrorHandler('Recipe Direction Not Found', 400))
  }

  const recipe = await Recipe.findById(recipeDirection.recipe)
  await RecipeDirections.findByIdAndDelete(req.body.recipeDirectionId)

  const newRecipeDirections = await RecipeDirections.find({ recipe: recipe._id})
  recipe.directions = []
  for(let i = 0; i < newRecipeDirections.length; i++){
    recipe.directions.push(newRecipeDirections[i])
  }
  recipe.save({ validateBeforeSave: false})

  res.status(200).json({
    success: true,
    message: 'Recipe Direction Deleted'
  })
})

export {
  createRecipeDirection,
  getRecipeDirection,
  updateRecipeDirection,
  deleteRecipeDirection
}