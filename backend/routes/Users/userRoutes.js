import express from 'express';

const router = express.Router()

// Controller Imports
import{ deleteUser, loginUser, registerUser, updateUser} from '../../controllers/Users/UsersController.js';

// Middleware Imports
import { protectUserLogin, AdminUserAuth } from '../../middleware/authMiddleware.js';

router.post('/login', loginUser)
router.post('/register', registerUser)
router.put('/', protectUserLogin, updateUser)
router.delete('/', protectUserLogin, AdminUserAuth, deleteUser)

export default router