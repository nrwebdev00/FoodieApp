import express from 'express';

const router = express.Router()

// Controller Imports
import{
  deleteUser,
  loginUser,
  registerUser,
  updateUser,
  forgotPassword,
  resetpassword,
  confirmEmail
} from '../../controllers/Users/UsersController.js';

// Middleware Imports
import { protectUserLogin, AdminUserAuth } from '../../middleware/authMiddleware.js';

router.post('/login', loginUser)
router.post('/register', registerUser)
router.post('/forgotpassword', forgotPassword)
router.get('/confirmemail', confirmEmail)
router.put('/', protectUserLogin, updateUser)
router.put('/resetpassword/:resettoken', resetpassword)
router.delete('/', protectUserLogin, AdminUserAuth, deleteUser)

export default router