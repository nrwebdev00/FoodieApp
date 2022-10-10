import mongoose from "mongoose";

const profileImageSchema = mongoose.Schema(
  {
    profile:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Profile'
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

const ProfileImage = mongoose.model('ProfileImage', profileImageSchema);
export default ProfileImage;