import mongoose from "mongoose";

const recipeIngredientSchema = mongoose.Schema(
  {
    recipe:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Recipe'
    },
    ingredientName:{
      type: String,
      required: true,
    },
    ingredientAmount:{
      type: Number,
      required: true,
    },
    ingredientMeasureBy:{
      type: String,
      required: true,
    }
  },
  {
    timestamps: true
  }
)

const RecipeIngredients = mongoose.model('RecipeIngredients', recipeIngredientSchema)

export default RecipeIngredients