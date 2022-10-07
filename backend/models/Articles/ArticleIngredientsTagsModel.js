import mongoose from "mongoose";

const articleIngredientsTagsSchema = mongoose.Schema(
  {
    article:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Article'
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

const ArticleIngredientsTags = mongoose.model('ArticleIngredientsTags', articleIngredientsTagsSchema)
export default ArticleIngredientsTags