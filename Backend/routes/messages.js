const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/:userId', authMiddleware, messageController.getMessages);
router.post('/', authMiddleware, messageController.sendMessage);
router.post('/upload', authMiddleware, upload.single('file'), messageController.uploadFile);

module.exports = router;
