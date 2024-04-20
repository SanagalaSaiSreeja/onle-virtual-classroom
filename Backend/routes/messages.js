const express = require('express')
const router = express.Router()

const messages = require('../controllers/messages');

router.get('/chat/:id', messages.getChatById);
router.get('/chat', messages.getAllChats);
router.post('/chat', messages.newChat);
router.delete('/chat/:id', messages.deleteChat);

module.exports = router