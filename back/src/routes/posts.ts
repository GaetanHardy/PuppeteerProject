/** source/routes/posts.ts */
import express from 'express';
import controller from '../controllers/posts';
const router = express.Router();

router.get('/scrap-email', controller.getEmails);
router.get('/scrap-email/excel', controller.getExcel);
export = router;