import asyncHandler from "express-async-handler";

// Models
import User from "../../models/Users/UserModel.js";
import Profile from "../../models/Users/ProfileModel.js";

// Utlis
import ErrorHandler from "../../utlis/errorHandler.js";
import { sendCookieWithTokenRes } from "../../utlis/generateTokenCookies.js";


// @desc Register User and create blank profile
// @route POST api/users/register
// @access PUBLIC
const registerUser = asyncHandler(async(req, res, next) => {
  const { userName, name, email, password } = req.body;

  // Check if Email or Username is in use
  const CheckEmail = await User.findOne({ email })
  const CheckUserName = await User.findOne({ userName })

  if(CheckEmail){
    return next(new ErrorHandler(`Email address of ${email} already exists.`, 400))
  }
  if(CheckUserName){
   return next(new ErrorHandler(`User Name of ${userName} already in use.`, 400))
  }

  // Create User and Profile
  const user = await User.create({
    userName, email, password
  })

  const profile = await Profile.create({
    name, user: user._id
  })

  if(user && profile){
   sendCookieWithTokenRes(user, 201, res)
  }else{
    return next(new ErrorHandler(`Server Error`, 500))
  }
 })

// @desc Login User
// @route POST api/users/login
// @access PUBLIC
const loginUser = asyncHandler(async(req, res, next) =>{
  const { userName, password} = req.body

  // Validate User Name and Password
  if(!userName || !password){
    return next(new ErrorHandler(`Please Provided a Valid User Name and Password`));
  }

  // Check User and Validate Password
  const user = await User.findOne({ userName }).select('+password');
  if(!user){
    return next(new ErrorHandler(`Invalid User Information`, 401))
  }

  const isPasswordMatch = await user.matchPassword(password)
  if(!isPasswordMatch){
    return next(new ErrorHandler(`Invalid User Information`, 401))
  }

  sendCookieWithTokenRes(user, 200, res)
})



// @desc Update user
// @route PUT api/users
// @access PRIVATE - SAME USER ONLY
const updateUser = asyncHandler(async(req, res) =>{

})

// @desc Delete User and Profile
// @route DELETE api/users
// @access PRIVATE - ADMIN ONLY
const deleteUser = asyncHandler(async(req, res) =>{

})

export { loginUser, registerUser, updateUser, deleteUser}