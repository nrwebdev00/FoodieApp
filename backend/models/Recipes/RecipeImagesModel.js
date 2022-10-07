import mongoose from 'mongoose';

const recipeImages = mongoose.Schema(
  {
    recipe:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Recipe'
    },
    asset_id:{
      type: String,
      required: true,
    },
    public_id:{
      type: String,
      required: true,
    },
    width:{
      type: Number,
      required: true,
    },
    height:{
      type: Number,
      required: true,
    },
    format:{
      type: String,
      required: true,
    },
    resource_type:{
      type: String,
      required: true,
    },
    url:{
      type: String,
      required: true,
    },
    secure_url:{
      type: String,
      required: true,
    }
  },
  {
    timestamps: true
  }
)

const RecipeImages = mongoose.model('RecipeImages', recipeImages)
export default RecipeImages