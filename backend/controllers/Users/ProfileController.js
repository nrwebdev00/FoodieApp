import asyncHandler from 'express-async-handler';

// Models



// @desc viewPublic Profiles
// @route GET api/profile
// @access PUBLIC
const getPublicProfile = asyncHandler(async(req, res) =>{

})


// @desc update Profile
// @route PUT api/profile
// @access PRIVATE - SAME USER
const updateProfile = asyncHandler(async(req, res) =>{

})

// @desc add Profile Image
// @route POST api/profile/Image
// @access PRIVATE - SAME USER
const addProfileImage = asyncHandler(async(req, res) =>{

})

// @desc Set avatar
// @route PUT api/profile/avatar
// @access PRIVATE - SAME USER
const updateAvatar = asyncHandler(async(req, res) =>{

})

// @desc Delete Profile Image
// @route DELETE api/profile/Image
// @access PRIVATE - SAME USER
const deleteProfileImage = asyncHandler(async(req, res) =>{

})

export { getPublicProfile, updateAvatar, updateProfile, addProfileImage, deleteProfileImage}