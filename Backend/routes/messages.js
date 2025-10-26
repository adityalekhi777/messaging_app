const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

router.get('/:userId', authMiddleware, messageController.getMessages);
router.post('/', authMiddleware, messageController.sendMessage);

module.exports = router;
