import mongoose from 'mongoose';

const recipeIngredientTagsSchema = mongoose.Schema(
  {
    recipe:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'Recipe'
    },
    name:{
      type: String,
      required: true,
    }
  },
  {
    timestamps: true
  }
)

const RecipeIngredientTags = mongoose.model('RecipeIngredientTags', recipeIngredientTagsSchema)

export default RecipeIngredientTags