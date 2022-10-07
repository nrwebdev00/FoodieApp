import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import User from '../models/Users/userModel.js';

const protectUserLogin = asyncHandler(async (req, res, next) =>{
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

const AdminUserAuth = (req, res, next) =>{
  if(req.user){
    if(req.user.role === 'admin'){
      next()
    }else{
      res.status(401)
      throw new Error('Not Authorized as role.')
    }
  }
}

const StaffUserAuth = (req, res, next) =>{
  if(req.user){
    if(req.user.role === 'admin'){
      next()
      return
    }
    if (req.user.role === 'staff') {
      next()
      return
    } else {
      res.status(401)
      throw new Error('Not Authorized as role.')
    }
  }
}


const ModeratorUserAuth = (req, res, next) =>{
  if(req.user){
    if(req.user.role === 'admin'){
      next()
      return
    }
    if (req.user.role === 'staff') {
      next()
      return
    }
    if(req.user.role === 'moderator'){
      next()
      return
    }else {
      res.status(401)
      throw new Error('Not Authorized as role.')
    }
  }
}


export { protectUserLogin, AdminUserAuth, StaffUserAuth, ModeratorUserAuth }