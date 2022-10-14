import asyncHandler from 'express-async-handler';

// Models
import RecipeTags from '../../models/Recipes/RecipeTagsModel.js';
import Recipe from '../../models/Recipes/RecipeModel.js';

// Utlis
import ErrorHandler from '../../utlis/errorHandler.js';


// @desc Create Recipe Tag
// @route POST /api/recipeTags
// @access PRIVATE - LOGIN STAFF, ADMIN
const createRecipeTags = asyncHandler(async(req, res, next) =>{
  const { name, type, recipeId } = req.body;
  const recipe = await Recipe.findById(recipeId);


  if(!recipe){
    return next(new ErrorHandler('Recipe not Found', 400))
  }

  if(!name || !type){
    return next(new ErrorHandler('Recipe Tag Name or Recipe Tag Type not given', 401))
  }


  const checkIfExists = await RecipeTags.find({
    recipe: recipeId,
    name: JSON.parse(JSON.stringify(name).toLowerCase()),
    type: JSON.parse(JSON.stringify(type).toLowerCase())
  })

  if(checkIfExists.length !== 0 ){
    return next(new ErrorHandler('Recipe Tag Already Exists', 400))
  }

  const recipeTag = await RecipeTags.create({
    recipe: recipeId,
    name: JSON.parse(JSON.stringify(name).toLowerCase()),
    type: JSON.parse(JSON.stringify(type).toLowerCase())
  })

  recipe.tag.push(recipeTag)
  recipe.save({ validateBeforeSave: false })

  if(!recipeTag){
    return next(new ErrorHandler('Recipe Tag not Created'), 500)
  }

  res.status(200).json({
    success: true,
    data: recipeTag
  })
  next()
})

// @desc Get All Recipe Tags - Advanced Results
// @route GET /api/recipeTags
// @access PUBLIC
const getAllRecipeTags = asyncHandler(async(req, res, next) =>{
  res.status(200).json(res.advancedResults)
})

// @desc Delete Recipe Tag
// @route DELETE /api/recipeTags
// @access PRIVATE - LOGIN STAFF, ADMIN
const deleteRecipeTags = asyncHandler(async(req, res, next) =>{
  const recipeTag = await RecipeTags.findById(req.body.recipeTagId)


  if(!recipeTag){
    return next(new ErrorHandler('Recipe Tag Not Found', 401))
  }

  const recipe = await Recipe.findById(recipeTag.recipe)

  await RecipeTags.findByIdAndDelete(req.body.recipeTagId)


  const newRecipeTag = await RecipeTags.find({ recipe: recipe._id })
  recipe.tag = []
  for(let i = 0; i < newRecipeTag.length; i++){
    recipe.tag.push(newRecipeTag[i])
  }

  recipe.save({ validateBeforeSave: false })




  res.status(200).json({
    success: true,
    message: 'Recipe Tag Deleted.'
  })
  next()
})

export {
  createRecipeTags,
  getAllRecipeTags,
  deleteRecipeTags
}