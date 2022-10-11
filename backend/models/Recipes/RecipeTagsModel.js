import mongoose from 'mongoose';

const recipeTagsSchema = mongoose.Schema(
  {
    recipe:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Recipe'
    },
    name:{
      type: String,
      required: true,
    },
    type:{
      type: String,
      required: true,
      enum:['courses','cuisines','holidays','ingredients' ]
    }
  },
  {
    timestamps: true,
  }
)

const RecipeTags = mongoose.model('RecipesTags',recipeTagsSchema)

export default RecipeTags