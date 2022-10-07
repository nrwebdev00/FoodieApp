import mongoose from 'mongoose';

const recipeDirectionsSchema = mongoose.Schema(
  {
    recipe:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Recipe'
    },
    stepNumber:{
      type: Number,
      required: true,
    },
    stepDirection:{
      type: String,
      required: true,
    },
    detailDirection:{
      type: String,
    },
    timeToComplete:{
      type: Number,
      required: true,
      default:1
    }
  },
  {
    timestamps: true
  }
)

const RecipeDirections = mongoose.model('RecipeDirections', recipeDirectionsSchema)

export default RecipeDirections