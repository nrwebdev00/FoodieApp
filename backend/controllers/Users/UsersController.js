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
  const user = await User.create({ userName, email, password })
  const profile = await Profile.create({ name, user: user._id })

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
  if(user.mustChangePassword){
    return next(new ErrorHandler(`User Must Change Password Before Long in`, 403))
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
  if(user.mustChangePassword){
    user.mustChangePassword = false
  }
  user.save()

  sendCookieWithTokenRes(user, 200, res)
})

// @desc Update Email Address
// @route PUT api/users/email
// @access PRIVATE - LOGIN
const changeEmail = asyncHandler(async(req, res, next) =>{
  const { updated_email } = req.body;
  const user = await User.findById(req.user._id)

  // Check Updated Email Address
  const checkEmail = await User.findOne({ email: updated_email })

  if(checkEmail){
    return next(new ErrorHandler(`Email Address is already in use`, 400))
  }

  user.email = updated_email;
  user.isEmailConfirmed = false;

  const confirmEmailToken = user.generateEmailConfirmToken();
  const confirmEmailUrl = `${req.protocol}://${req.get('host',)}/api/users/confirmemail?token=${confirmEmailToken}`;
  const message = `You are receiving this email because you need to confirm your email address. Please make a GET request to: \n\n ${confirmEmailUrl}`;

  const updated_user = user.save({ validateBeforeSave: false })

  if(updated_user){

    const sendConfirmEmail = await sendEmail({
      email: updated_email,
      subject: 'Confirm Email for the Foodie App',
      message
    })

    sendCookieWithTokenRes(user, 201, res)

  }else{
    return next(new ErrorHandler(`Server Error`, 500))
  }
})

// @desc Update Password
// @route PUT api/users/password
// @access PRIVATE - LOGIN
const changePassword = asyncHandler(async(req, res, next) =>{
  const user = await User.findById(req.user._id)
  const { updated_password } = req.body;

  if(!updated_password){
    return next(new ErrorHandler('No Password to Updated', 401))
  }

  user.password = updated_password
  if(user.mustChangePassword){
    user.mustChangePassword = false;
  }
  const updated_user = await user.save()

  if(!updated_user){
    return next(new ErrorHandler('Unable to update password'), 500)
  }

  sendCookieWithTokenRes(user, 201, res)

})

// @desc Delete User and Profile
// @route DELETE api/users
// @access PRIVATE - ADMIN ONLY
const deleteUser = asyncHandler(async(req, res, next) =>{
  const { user_id } = req.body;
  const user = await User.findById(user_id)
  const profile = await Profile.findOne({user: user_id})

  if(user && profile){
    await User.findByIdAndDelete(user_id);
    await Profile.findOneAndDelete({ user: user_id});
    res.status(201).json({
      success: true,
      message: 'User and Profile Deleted'
    })
    next()
  }else{
    return next(new ErrorHandler('User or Profile Not Found', 401))
  }
})

// @desc Admin Create User With Roles
// @route POST api/users/new
// @access PRIVATE - ADMIN ONLY
const newUser = asyncHandler(async(req, res, next) =>{
  const { userName, name, email, password, role } = req.body;

  // Check if Email or Username is in Use
  const checkEmail = await User.findOne({ email })
  const checkUserName = await User.findOne({ userName })

  if(checkEmail){
    return next(new ErrorHandler(`Email address of ${email} already exists.`, 400))
  }
  if(checkUserName){
    return next(new ErrorHandler(`User Name of ${userName} already exists`, 400))
  }

  const user = await User.create({ userName, email, password, role, mustChangePassword: true })
  const profile = await Profile.create({ name, user:user._id})

  if(user && profile){
    res.status(201).json({
      success: true,
      message: `New User, ${name} was created with email of ${email} and Username of ${userName}.`
    })
  }else{
    return next(new ErrorHandler(`Server Error`, 500))
  }

})

export {
  loginUser,
  registerUser,
  deleteUser,
  forgotPassword,
  resetpassword,
  confirmEmail,
  changeEmail,
  changePassword,
  newUser
}