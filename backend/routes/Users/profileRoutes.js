import express from 'express'

const router = express.Router()

import { addProfileImage, deleteProfileImage, getPublicProfile, updateAvatar, updateProfile } from '../../controllers/Users/ProfileController.js';

router.get('/', getPublicProfile)

export default router