import path from 'path';
import express from 'express';
import multer from 'multer';

// Controllers
import { uploadProfilePicture } from '../../controllers/Uploads/uploadController.js';

// Middleware
import { protectUserLogin } from '../../middleware/authMiddleware.js';

const router = express.Router();

let publicFileName;
const storage = multer.diskStorage({
  filename(req, file, cb){
    publicFileName = `${file.fieldname}${Date.now()}-${Math.floor(Math.random() * 500000) + 1}${path.extname(file.originalname)}`
    cb(null, publicFileName)
  }
})

const upload = multer({
  storage
});

router.post('/profile', protectUserLogin, upload.single('profileImage'), uploadProfilePicture)

export default router