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
      default: 'USA'
    },
    bio:{
      type: String,
      required: true,
      default: 'New Bio Coming Soon...'
    },
    avatar:{
      type: String,
      required: true,
      default: 'https://cdn.pixabay.com/photo/2016/10/27/08/11/cook-1773638__340.png'
    },
    following:[],
    beingFollowedBy:[],
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
    },
    createdAt:{
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true
  }
)

const Profile = mongoose.model('Profile', profileSchema)
export default Profile