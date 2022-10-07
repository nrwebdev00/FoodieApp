import mongoose from 'mongoose';

const profileSchema = mongoose.Schema(
  {
    user:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'User'
    },
    name:{
      type: String,
      required: true,
    },
    location:{
      type: String,
      required: true,
    },
    bio:{
      type: String,
      required: true,
    },
    avatar:{
      type: String,
      required: true,
      default: 'https://cdn.pixabay.com/photo/2016/10/27/08/11/cook-1773638__340.png'
    },
    previousImages:[
      {
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
      }
    ],
    facebookUrl:{
      type: String,
    },
    twitterUrl:{
      type: String,
    },
    youtubeUrl:{
      type: String,
    },
    twitchUrl:{
      type: String,
    },
    printerestUrl:{
      type: String,
    },
    instagramUrl:{
      type: String,
    },
    websiteUrl:{
      type: String,
    }
  },
  {
    timestamps: true
  }
)

const Profile = mongoose.model('Profile', profileSchema)
export default Profile