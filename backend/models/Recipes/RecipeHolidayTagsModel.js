import mongoose from 'mongoose';

const recipeHolidayTags = mongoose.Schema(
  {
    recipe:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Recipe'
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

const RecipeHolidayTags = mongoose.model('RecipeHolidayTags', recipeHolidayTags)

export default RecipeHolidayTags