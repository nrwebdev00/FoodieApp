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

const RecipeIngredient = mongoose.model('RecipeIngredient', recipeIngredientSchema)

export default RecipeIngredient