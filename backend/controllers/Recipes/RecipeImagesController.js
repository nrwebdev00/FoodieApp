import asyncHandler from 'express-async-handler';

// Models
import Recipe from '../../models/Recipes/RecipeModel.js';
import RecipeImages from '../../models/Recipes/RecipeImagesModel.js'

// Utlis
import ErrorHandler from '../../utlis/errorHandler.js';



// @desc Create Recipe Image
// @route POST /api/recipeImage
// @access PRIVATE - LOGIN STAFF ADMIN
const createRecipeImage = asyncHandler(async(req, res, next) =>{
  const {
    recipeId,
    asset_id,
    public_id,
    width,
    height,
    format,
    resource_type,
    url,
    secure_url
  } = req.body
  const recipe = await Recipe.findById(recipeId)

  if(!recipe){
    return next(new ErrorHandler('Recipe Not Found', 400))
  }

  const recipeImage = await RecipeImages.create({
    recipe: recipeId,
    asset_id,
    public_id,
    width,
    height,
    format,
    resource_type,
    url,
    secure_url
  })

  if(!recipeImage){
    return next(new ErrorHandler('Recipe Image Not Add', 500))
  }

  recipe.images.push(recipeImage)
  recipe.save({ validateBeforeSave: false})

  res.status(200).json({
    success: true,
    data: recipeImage
  })
  next()
})

// @desc Get Single Recipe Image
// @route GET /api/recipeImage/:id
// @access PUBLIC
const getRecipeImage = asyncHandler(async(req, res, next) =>{
  const { id } = req.params;
  const recipeImage = await RecipeImages.findById(id)

  if(!recipeImage){
    return next(new ErrorHandler('Recipe Image Not Found', 400))
  }

  res.status(200).json({
    success: true,
    data: recipeImage
  })
  next()
})

// @desc Get all Recipe Images - Advance Result
// @route GET /api/recipeImage
// @access PUBLIC
const getAllRecipeImage = asyncHandler(async(req, res, next) =>{
  res.status(200).json(res.advancedResults)
})


// @desc Delete Recipe Image
// @route DELETE /api/recipeImage
// @access PRIVATE - LOGIN STAFF ADMIN
const deleteRecipeImage = asyncHandler(async(req, res, next) =>{
  const recipeImage = await RecipeImages.findById(req.body.recipeImageId)

  if(!recipeImage){
    return next(new ErrorHandler('Recipe Image Not Found', 400))
  }

  const recipe = await Recipe.findById(recipeImage.recipe)
  await RecipeImages.findByIdAndDelete(req.body.recipeImageId)

  const newRecipeImage = await RecipeImages.find({ recipe: recipe._id })
  recipe.images = []
  for(let i = 0; i < newRecipeImage.length; i++){
    recipe.images.push(newRecipeImage[i])
  }
  recipe.save({ validateBeforeSave: false})

  res.status(200).json({
    success: true,
    message: 'Recipe Image Deleted'
  })

})

export {
  createRecipeImage,
  getAllRecipeImage,
  getRecipeImage,
  deleteRecipeImage
}
