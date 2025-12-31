import { Router } from "express"
import { getAllLead,addLead, updateStatus,getAllDropdownData } from "../controllers/lead.controller.js"

const router = Router()

router.post('/', getAllDropdownData)
router.post('/all', getAllLead)
router.post('/add', addLead)
router.post('/updateStatus', updateStatus)

export default router
