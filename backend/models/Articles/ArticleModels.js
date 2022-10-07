import mongoose from "mongoose";

const articleSchema = mongoose.Schema(
  {
    user:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title:{
      type: String,
      required: true,
    },
    article:{
      type: String,
      required: true,
    },
    mainImage:{
      type: String,
      required: true,
    },
    recipe:[],
  },
  {
    timestamps: true
  }
)

const Article = mongoose.model('Article', articleSchema)
export default Article