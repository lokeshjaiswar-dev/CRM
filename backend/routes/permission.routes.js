import Router from 'express'
import {addPermission, allPermissions, updateStatus} from "../controllers/permission.controller.js"

const router = Router()

router.post("/", allPermissions)
router.post("/add", addPermission)
router.post("/updateStatus", updateStatus)

export default router