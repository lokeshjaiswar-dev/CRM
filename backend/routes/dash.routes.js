import Router from 'express'
import { getAllDashData } from '../controllers/dash.controller.js'

const router = Router()

router.post('/', getAllDashData)

export default router