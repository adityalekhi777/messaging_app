const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authMiddleware, authController.getAllUsers);
router.get('/messages/:userId', authMiddleware, authController.getMessages);
router.post('/messages', authMiddleware, authController.sendMessage);

module.exports = router;