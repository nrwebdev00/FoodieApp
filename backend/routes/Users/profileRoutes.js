import express from 'express'

// Controllers
import { getPublicProfile, getPublicProfiles } from '../../controllers/Users/ProfileController.js';

// Middleware
import advanceResults from '../../middleware/advanceResult.js';

// Models
import Profile from '../../models/Users/ProfileModel.js';

const router = express.Router()



router.get('/', advanceResults(Profile), getPublicProfiles)
router.get('/:id', getPublicProfile )

export default router