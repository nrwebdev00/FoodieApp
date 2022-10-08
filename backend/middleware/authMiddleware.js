import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import User from '../models/Users/UserModel.js';
import ErrorHandler from "../utlis/errorHandler.js";

const protectUserLogin = asyncHandler(async (req, res, next) =>{
  let token

  if(
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ){
    token = req.headers.authorization.split(' ')[1];
  }

  if(!token){
    return next(new ErrorHandler(process.env.ERROR_NOT_AUTHORIZED, 401));
  }
  try {
    // Decode token and get user --> req.user now available
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    if(!req.user){
      return next(new ErrorHandler(process.env.ERROR_NOT_AUTHORIZED, 401))
    }
    next()
  } catch (error) {
    return next(new ErrorHandler(process.env.ERROR_NOT_AUTHORIZED, 401))
  }

})

const AdminUserAuth = (req, res, next) =>{
 if(req.user.role !== 'admin'){
  return next(new ErrorHandler(process.env.ERROR_NOT_AUTHORIZED, 401))
 }
 next()
}

const StaffUserAuth = (req, res, next) =>{
  if(req.user.role === 'admin' || req.user.role === 'staff'){
    next()
  }else{
    return next(new ErrorHandler(process.env.ERROR_NOT_AUTHORIZED, 401))
  }
}


const ModeratorUserAuth = (req, res, next) =>{
  if(req.user.role === 'admin' || req.user.role === 'staff' || req.user.role === 'moderator'){
    next()
  } else{
    return next(new ErrorHandler(process.env.ERROR_NOT_AUTHORIZED, 401))
  }
}


export { protectUserLogin, AdminUserAuth, StaffUserAuth, ModeratorUserAuth }