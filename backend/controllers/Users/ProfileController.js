import asyncHandler from 'express-async-handler';

// Models
import Profile from '../../models/Users/ProfileModel.js';
import ProfileImage from '../../models/Users/ProfileImageModel.js';

// Utlis
import ErrorHandler from '../../utlis/errorHandler.js';



// @desc viewPublic Profiles Single
// @route GET api/profile/single/:id
// @access PUBLIC
const getPublicProfile = asyncHandler(async(req, res, next) =>{
  const profile = await Profile.find({ user: req.params.id })

  if(!profile){
    return next(new ErrorHandler('User Profile Not Found', 401))
  }

  res.status(200).json({
    profile
  })
  next()
})

// @desc View All Public Profiles
// @route GET api/profile
// @access PUBLIC
const getPublicProfiles = asyncHandler(async(req, res, next) =>{
  res.status(200).json(res.advancedResults);
  next()
})

// @desc update Profile
// @route PUT api/profile
// @access PRIVATE - SAME USER
const updateProfile = asyncHandler(async(req, res, next) =>{
  const profile = await Profile.findOne({ user:req.user._id })

  if(profile){
    profile.name = req.body.name || profile.name
    profile.location = req.body.location || profile.location
    profile.bio = req.body.bio || profile.bio
    profile.facebookUrl = req.body.facebookUrl || profile.facebookUrl
    profile.twitterUrl = req.body.twitterUrl || profile.twitterUrl
    profile.youtubeUrl = req.body.youtubeUrl || profile.youtubeUrl
    profile.twitchUrl = req.body.twitchUrl || profile.twitchUrl
    profile.printerestUrl = req.body.printerestUrl || profile.printerestUrl
    profile.instagramUrl = req.body.instagramUrl || profile.instagramUrl
    profile.websiteUrl = req.body.websiteUrl || profile.websiteUrl

    const updatedProfile = await profile.save()

    res.status(200).json({
      success: true,
      data: updatedProfile
    })
    next()
  }else{
    return next(new ErrorHandler('Profile Not Found', 401))
  }

})

// @desc add Profile Image
// @route POST api/profile/Image
// @access PRIVATE - SAME USER
const addProfileImage = asyncHandler(async(req, res, next) =>{
  const profile = await Profile.findOne({ user:req.user._id})
  const { asset_id, public_id, width, height, format, resource_type, url, secure_url } = req.body;

  if(!profile){
    return next(new ErrorHandler('Unable Upload File'), 500)
  }

  const profileImage = await ProfileImage.create({
    profile: profile._id,
    asset_id,
    public_id,
    width,
    height,
    format,
    resource_type,
    url,
    secure_url
  })

  if(!profileImage){
    return next(new ErrorHandler(`Unable Upload File`), 500)
  }

  res.status(200).json({
    success: true,
    data: profileImage
  })
})

// @desc Get all Profile Images for Profile
// @route GET api/profile/Image
// @access PRIVATE - SAME USER
const getAllProfileImages = asyncHandler(async(req, res, next) =>{
  const profile = await Profile.findOne({ user: req.user._id})

  if(!profile){
    return next(new ErrorHandler('Profile not Found', 401))
  }

  const images = await ProfileImage.find({ profile: profile._id })

  if(!images){
    return next(new ErrorHandler('No Images Found For User.', 401))
  }

  res.status(200).json({
    success: true,
    data: images
  })
  next()
})

// @desc Set avatar
// @route PUT api/profile/avatar
// @access PRIVATE - SAME USER
const updateAvatar = asyncHandler(async(req, res, next) =>{
  const profile = await Profile.findOne({ user: req.user._id })
  const image = await ProfileImage.findById(req.body.image_id)

  if(!profile || !image){
    return next(new ErrorHandler('No Profile or Image Found', 401))
  }
  if(req.protocol === 'http'){
    profile.avatar = image.url
    profile.save()
    res.status(200).json({
      success: true,
      message: 'Avatar Updated'
    })
  }else{
    profile.avatar = image.secure_url
    profile.save()
    res.status(200).json({
      success: true,
      message: 'Avatar Updated'
    })
  }
})

// @desc Delete Profile Image
// @route DELETE api/profile/Image
// @access PRIVATE - SAME USER
const deleteProfileImage = asyncHandler(async(req, res, next) =>{
  const image = await ProfileImage.findById(req.body.image_id)
  if(!image){
    return next(new ErrorHandler('Image Not Found', 401))
  }
  await ProfileImage.findByIdAndDelete(req.body.image_id)
  res.status(200).json({
    success: true,
    message: 'Image Deleted'
  })
})

// @desc Follow User
// @route PUT api/profile/follow
// @access PRIVATE - LOGIN
const followUser = asyncHandler(async(req, res, next) =>{
  const profile = await Profile.findOne({ user: req.user._id})
  const followingProfile = await Profile.findById(req.body.following_id)

  if(!profile || !followingProfile ){
    return next(new ErrorHandler('Not able to Find user to Follow', 400))
  }

  const checkProfileFollowing = profile.following.includes(followingProfile._id)
  const checkFollowingProfile = followingProfile.beingFollowedBy.includes(profile._id)

  if(!checkProfileFollowing){
    profile.following.push(followingProfile._id)
    await profile.save({ validateBeforeSave: false})
  }else{
    return next(new ErrorHandler('Already following User'), 400)
  }

  if(!checkFollowingProfile){
    followingProfile.beingFollowedBy.push(profile._id)
    await followingProfile.save({ validateBeforeSave: false})
  }

  res.status(200).json({
    success: true,
    message: 'Following User.'
  })

})

export {
  getPublicProfile,
  getPublicProfiles,
  updateAvatar,
  updateProfile,
  addProfileImage,
  deleteProfileImage,
  followUser,
  getAllProfileImages
}