import express from 'express';
import {
    add_file,
    get_file_by_id,
    get_user_files,
    share_file,
    deleteFile
} from './controller.js';
import {authenticate, authorize} from '../../middleware/auth.js';
import {upload} from '../../middleware/multer.js';

const router = express.Router();

router.post('/file', upload.single('file'), add_file);
router.get('/file/user', authenticate, authorize('user'), get_user_files);
router.get('/file/:id', authenticate, get_file_by_id);
router.get('/file/share/:token', share_file);
router.delete('/file/:id', authenticate, authorize('user'), deleteFile);

export default router;