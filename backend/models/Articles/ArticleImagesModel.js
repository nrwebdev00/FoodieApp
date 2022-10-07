import mongoose from 'mongoose';

const articleImagesSchema = mongoose.Schema(
  {
    article:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Article'
    },
    asset_id:{},
    public_id:{},
    width:{},
    height:{},
    format:{},
    resource_type:{},
    url:{},
    secure_url:{}
  }
)

const ArticleImages = mongoose.model('ArticleImages', articleImagesSchema)
export default ArticleImages