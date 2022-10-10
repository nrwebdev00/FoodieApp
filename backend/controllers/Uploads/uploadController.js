import path from 'path';
import asyncHandler from "express-async-handler";
import cloudinary from "cloudinary";

// Models


// Utlis
import ErrorHandler from "../../utlis/errorHandler.js";


// @desc Upload Profile Picture To Cloudinary
// @route POST /api/upload/profile
// @access PRIVATE - LOGIN
const uploadProfilePicture = asyncHandler(async(req, res, next) =>{
  const file = req.file

  cloudinary.v2.uploader.upload(file.path,
    { public_id: `profileImage/${file.filename}`},)
    .then((result) =>{
      res.status(200).json({
        success: true,
        result
      })
      next()
    })
    .catch((error) =>{
      return next(new ErrorHandler('Unable to Upload Photo', 500))
    })
})

export { uploadProfilePicture }