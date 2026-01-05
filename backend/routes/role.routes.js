import Router from 'express'
import { addRole, allRoleWithPermission} from '../controllers/role.controller.js';

const router = Router()

router.post('/addRole', addRole)
router.get('/', allRoleWithPermission)

export default router;