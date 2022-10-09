import asyncHandler from "express-async-handler";
import crypto from 'crypto'

// Models
import User from "../../models/Users/UserModel.js";
import Profile from "../../models/Users/ProfileModel.js";

// Utlis
import ErrorHandler from "../../utlis/errorHandler.js";
import sendEmail from "../../utlis/sendEmail.js";
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

  const confirmEmailToken = user.generateEmailConfirmToken();

  const confirmEmailUrl = `${req.protocol}://${req.get('host',)}/api/users/confirmemail?token=${confirmEmailToken}`

  const message = `You are receiving this email because you need to confirm your email address. Please make a GET request to: \n\n ${confirmEmailUrl}`;

  user.save({ validateBeforeSave: false })

  const sendConfirmEmail = await sendEmail({
    email: user.email,
    subject: 'Confirm Email for the Foodie App',
    message,
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

// @desc Confirm Email Address
// @route GET api/users/confirmemail/:token
// @access PUBLIC
const confirmEmail = asyncHandler(async(req, res, next) =>{
  const { token } = req.query;

  if(!token){
    return next(new ErrorHandler('Invalid Token', 400));
  }

  const spiltToken = token.split('.')[0];
  const confirmEmailToken = crypto
    .createHash('sha256')
    .update(spiltToken)
    .digest('hex');

  // Get User by Token
  const user = await User.findOne({ confirmEmailToken, isEmailConfirmed: false });

  if(!user){
    return next(new ErrorHandler(`Invalid Token`, 400))
  }

  user.confirmEmailToken = undefined;
  user.isEmailConfirmed = true
  user.save({ validateBeforeSave: false })

  sendCookieWithTokenRes(user, 200, res)

})

// @desc Forgot Password
// @route POST api/users/forgotPassword
// @access PUBLIC
const forgotPassword = asyncHandler(async(req, res, next) =>{
  const user = await User.findOne({ email: req.body.email });

  if(!user){
    return next(new ErrorHandler(`There is no user with that email`, 404));
  }

  const resetToken = user.getForgotPasswordToken();

  await user.save({ validateBeforeSave: false})

  const resetUrl = `${req.protocol}://${req.get('host',)}/api/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      message,
    });

    res.status(200).json({ success: true, data: `Email Sent`});
  } catch (error) {
    console.error(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false })
    return next(new ErrorHandler('Password Reset Could Not Be Sent.', 500))
  }
})

// @desc Reset Forgot Password
// @route PUT api/users/resetpassword
// @access PUBLIC
const resetpassword = asyncHandler(async(req, res, next) =>{
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if(!user){
    return next(new ErrorHandler('Invalid Reset Password Token', 400))
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.save()

  sendCookieWithTokenRes(user, 200, res)
})


// @desc Update user
// @route PUT api/users
// @access PRIVATE - SAME USER ONLY
const updateUser = asyncHandler(async(req, res) =>{

  res.json({ success: true})
})

// @desc Delete User and Profile
// @route DELETE api/users
// @access PRIVATE - ADMIN ONLY
const deleteUser = asyncHandler(async(req, res) =>{

})

export { loginUser, registerUser, updateUser, deleteUser, forgotPassword, resetpassword, confirmEmail}