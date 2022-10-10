import express from 'express'

const router = express.Router()

import { getPublicProfile } from '../../controllers/Users/ProfileController.js';

router.get('/:id', getPublicProfile )

export default router