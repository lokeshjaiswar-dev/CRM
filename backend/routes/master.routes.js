import { Router } from "express";
import {viewType, addType, removeType, updateType} from "../controllers/master.controller.js"

const router = Router()

router.post('/all', viewType)
router.post('/addType', addType)
router.post('/removeType', removeType)
router.post('/updateType', updateType)

export default router;