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
    return next(new ErrorHandler('Recipe not Found', 401))
  }

  if(!name || !type){
    return next(new ErrorHandler('Recipe Tag Name or Recipe Tag Type not given', 401))
  }


  const checkIfExists = await RecipeTags.find({
    recipe: recipeId,
    name: JSON.parse(JSON.stringify(name).toLowerCase()),
    type: JSON.parse(JSON.stringify(type).toLowerCase())
  })

  console.log(checkIfExists.length)

  if(checkIfExists.length !== 0 ){
    return next(new ErrorHandler('Recipe Tag Already Exists', 400))
  }

  const recipeTag = await RecipeTags.create({
    recipe: recipe._id,
    name: JSON.parse(JSON.stringify(name).toLowerCase()),
    type: JSON.parse(JSON.stringify(type).toLowerCase())
  })

  recipe.tag.push(recipeTag._id)
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
    return next(new ErrorHandler('Recipe Tag Not Found'), 401)
  }

  await RecipeTags.findByIdAndDelete(req.body.recipeTagId)

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