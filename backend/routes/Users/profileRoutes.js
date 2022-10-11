import express from 'express'

// Controllers
import {
  getPublicProfile,
  getPublicProfiles,
  addProfileImage,
  updateProfile,
  getAllProfileImages,
  updateAvatar,
  deleteProfileImage,
  followUser

} from '../../controllers/Users/ProfileController.js';

// Middleware
import advanceResults from '../../middleware/advanceResult.js';
import { protectUserLogin } from '../../middleware/authMiddleware.js';

// Models
import Profile from '../../models/Users/ProfileModel.js';

const router = express.Router()

router.get('/', advanceResults(Profile), getPublicProfiles)
router.get('/single/:id', getPublicProfile )
router.post('/image', protectUserLogin, addProfileImage)
router.get('/image', protectUserLogin, getAllProfileImages)
router.put('/', protectUserLogin, updateProfile)
router.put('/avatar', protectUserLogin, updateAvatar)
router.put('/following', protectUserLogin, followUser)
router.delete('/image', protectUserLogin, deleteProfileImage)

export default router