import { json } from 'express';
import asyncHandler from 'express-async-handler';

// Models
import Profile from '../../models/Users/ProfileModel.js';

// Utlis
import ErrorHandler from '../../utlis/errorHandler.js';



// @desc viewPublic Profiles Single
// @route GET api/profile/:id
// @access PUBLIC
const getPublicProfile = asyncHandler(async(req, res, next) =>{
  const profile = await Profile.find({ user: req.params.id })

  if(!profile){
    return next(new ErrorHandler('User Profile Not Found', 401))
  }

  res.json({
    profile
  })
})

// @desc View All Public Profiles
// @route GET api/profile
// @access PUBLIC
const getPublicProfiles = asyncHandler(async(req, res, next) =>{
  res.status(200).json(res.advancedResults);
})


// @desc update Profile
// @route PUT api/profile
// @access PRIVATE - SAME USER
const updateProfile = asyncHandler(async(req, res, next) =>{

})

// @desc add Profile Image
// @route POST api/profile/Image
// @access PRIVATE - SAME USER
const addProfileImage = asyncHandler(async(req, res, next) =>{

})

// @desc Set avatar
// @route PUT api/profile/avatar
// @access PRIVATE - SAME USER
const updateAvatar = asyncHandler(async(req, res, next) =>{

})

// @desc Delete Profile Image
// @route DELETE api/profile/Image
// @access PRIVATE - SAME USER
const deleteProfileImage = asyncHandler(async(req, res, next) =>{

})

// @desc Follow User
// @route POST api/profile/follow
// @access PRIVATE - LOGIN
const followUser = asyncHandler(async(req, res, next) =>{

})

export {
  getPublicProfile,
  getPublicProfiles,
  updateAvatar,
  updateProfile,
  addProfileImage,
  deleteProfileImage,
  followUser
}