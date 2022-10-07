import mongoose from 'mongoose';

const recipeCuisineTagsSchema = mongoose.Schema(
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

const RecipeCuisineTags = mongoose.model('RecipeCuisineTags', recipeCuisineTagsSchema)

export default RecipeCuisineTags