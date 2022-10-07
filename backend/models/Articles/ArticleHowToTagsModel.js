import mongoose from 'mongoose';

const articleHowToTagsSchema = mongoose.Schema(
  {
    article: {
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

const ArticleHowToTags = mongoose.model('ArticleHowToTags', articleHowToTagsSchema)
export default ArticleHowToTags