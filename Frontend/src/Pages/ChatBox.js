import React, { useState, useEffect } from "react";
import axios from "axios";
import io from 'socket.io-client';

const ChatBox = ({ studentName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket=io('http://localhost:5001')

  useEffect(() => {
    fetchMessages();
  }, [studentName]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/messages/chat/${studentName}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async (event) => {
        event.preventDefault();
        const params = {
            message: newMessage,
            user_id: studentName._id, 
            chat_id: studentName._id,
            created: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()  
        }
        await socket.emit("send_message", params);
        setNewMessage("");
    }

  return (
    <div className="chat-box-container">
      <div onClick={toggleChatBox} className="chat-header">
        {studentName}
      </div>
      {isOpen && (
        <div className="chat-box">
          {/* Render chat messages */}
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index}>
                <strong>{message.sender}: </strong>
                {message.content}
              </div>
            ))}
          </div>
          {/* Chat input field */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          {/* Send button */}
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
