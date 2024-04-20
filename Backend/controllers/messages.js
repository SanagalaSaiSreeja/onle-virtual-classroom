const Message = require('../models/Message');

// Controller function for sending a message
const sendMessage = async (req, res) => {
  const { sender, recipient, content } = req.body;
  try {
    // Create a new message and save it to the database
    const newMessage = await Message.create({ sender, recipient, content });
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function for retrieving messages for a specific user
const getMessages = async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch messages where the user is either the sender or recipient
    const messages = await Message.find({ $or: [{ sender: userId }, { recipient: userId }] });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { sendMessage, getMessages };

// save messages to database 
// retrieve chats from database 


const getChatById = async (req, res) => {
    let chatId = req.params.id;
    let chat; 
    try {
        chat = await Message.findById(chatId).populate('users', '_id name');
        res.json(chat);
    } catch (err){
        res.status(404).json({
            message: 'Chat not found'
        })
    }
}

const getAllChats = async(req, res) => {
    try {
        const chats = await Message.find().populate('users', '_id name');
        res.status(200).json(chats);
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const newChat = async (req, res) => {
    let chat = new Message({
        users: [req.body.user1, req.body.user2],
        messages: []
    })
    try {
        const newChat = await chat.save();
        res.status(201).json(newChat);
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}

const deleteChat = async (req, res) => {
    let chatId = req.params.id;
    let chat; 
    try {
        chat = await Message.findById(chatId);
        chat.remove();
        res.status(410).json();
    } catch (err){
        res.status(404).json({
            message: 'Chat not found'
        })
    }
}

module.exports = {getChatById, newChat, deleteChat, getAllChats}

