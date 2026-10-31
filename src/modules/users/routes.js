import express from 'express';
import {
    user_sign_up,
    sign_in,
    admin_sign_up,
    get_all_users,
    get_user_by_email,
    get_user_by_name,
    get_user_by_id,
    update_user,
    delete_user
} from './controller.js';
import {authenticate, authorize} from '../../middleware/auth.js';


const router = express.Router();

router.post('/auth/signup', user_sign_up);
router.post('/auth/admin/signup', authenticate, authorize('admin'), admin_sign_up);
router.post('/auth/signin', sign_in);
router.get('/admin/users', authenticate, authorize('admin'), get_all_users);
router.get('/user/email', authenticate, authorize('admin'), get_user_by_email);
router.get('/user/name', authenticate, authorize('admin'), get_user_by_name);
router.get('/user/:id', authenticate, authorize('admin'), get_user_by_id);
router.put('/user', authenticate, authorize('user'), update_user);
router.delete('/user/:id', authenticate, authorize('user', 'admin'), delete_user);

export default router;