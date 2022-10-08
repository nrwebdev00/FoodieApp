import mongoose from "mongoose";

const articleCultureTagsSchema = mongoose.Schema(
  {
    article:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Article'
    },
    name:{
      type: String,
      required: true
    }
  },
  {
      timestamps: true
  }
)

const ArticleCultureTags = mongoose.model('ArticleCultureTags', articleCultureTagsSchema)
export default ArticleCultureTags