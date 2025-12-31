import { Router } from "express"
import { getAllStaff, addStaff } from '../controllers/staff.controller.js'

const router = Router()

router.post('/all', getAllStaff)
router.post('/add', addStaff)

export default router