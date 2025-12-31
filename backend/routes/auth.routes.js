import { Router } from "express";
import {login,register,currentUser, updateUser, updatePassword} from '../controllers/auth.controller.js'

const router = Router()

router.post('/login', login)
router.post('/register', register)
router.post('/me', currentUser)
router.post('/updateUser', updateUser)
router.post('/updatePassword', updatePassword)

export default router;