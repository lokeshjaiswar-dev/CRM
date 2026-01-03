import { Router } from "express";

import {
  viewType, addType, removeType, updateType,
  viewSource, addSource, removeSource, updateSource,
  viewStatus, addStatus, removeStatus, updateStatus
} from "../controllers/master.controller.js";


const router = Router()

router.post('/allType', viewType)
router.post('/addType', addType)
router.post('/deleteType', removeType)
router.post('/updateType', updateType)

router.post('/allSource', viewSource)
router.post('/addSource', addSource)
router.post('/deleteSource', removeSource)
router.post('/updateSource', updateSource)

router.post('/allStatus', viewStatus)
router.post('/addStatus', addStatus)
router.post('/deleteStatus', removeStatus)
router.post('/updateStatus', updateStatus)

export default router;