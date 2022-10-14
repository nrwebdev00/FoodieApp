import mongoose from "mongoose";

const recipeSchema = mongoose.Schema(
  {
    user:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title:{
      type: String,
      required: true,
      default: 'New Recipe...'
    },
    desc:{
      type: String,
      required: true,
      default: 'About New Recipe...'
    },
    mainImage:{
      type: String,
      required: true,
      default:'https://res.cloudinary.com/dnrlolvnu/image/upload/v1664246338/recipeImage/recipe-02_mogrts.webp',
    },
    isPublic:{
      type: Boolean,
      required: true,
      default: false,
    },
    isPublicApproved:{
      type: Boolean,
      required: true,
      default: false,
    },
    tag:[],
    directions:[],
    ingredients:[],
    images:[],
  },
  {
    timestamps: true
  }
)

const Recipe = mongoose.model('Recipe', recipeSchema)
export default Recipe