/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import FriendsList from "../components/FriendsList";
import {createContext} from 'react';
import Chat from "../components/Chat";
import Search from "../components/Search";
import UserContext from "../UserContext";
import { useNavigate } from "react-router-dom";
import './Chat.css';
import React, { useRef } from 'react';
import Header from "./Header";
import Sidebar from "./Sidebar";
import io from 'socket.io-client';
import StudentList from './StudentList'
import ChatContainer from "../containers/ChatContainer";
import UserContainer from '../containers/UserContainer';
import {Routes, Route} from 'react-router-dom';


    const Chats = ({currentChat, updateChat}) => {
    const name = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");
    const spleet = name.split(" ");
    const fName = spleet[0];
        const UserContext = createContext({
            loggedInUser: fName,
        });
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const [loggedInUser, setLoggedInUser] = useState();
    const [users, setUsers] = useState([]);
    const [chats, setChats] = useState([]);
    
    const socket = io.connect("http://localhost:5001");

    const fetchUsers = async () => {
        const response = await fetch('http://localhost:4000/api/addstudents');
        const userData = await response.json();
        setUsers(userData);
    }

    const fetchChats = async () => {
        const response = await fetch('http://localhost:5001/api/messages/chat');
        const chatData = await response.json();
        setChats(chatData);
    }


    useEffect(() => {
        fetchUsers();
        fetchChats();
    }, [])
  
    
   

    
        const handleMessageChange = (event) => {
            setMessageInput(event.target.value);
        }
    
        
    
        const findUsername = () => {
            const chatUser = currentChat.users[0]._id === loggedInUser._id ? currentChat.users[1].username : currentChat.users[0].username;
            return chatUser
        }
    
        socket.on("receive_message", (message) => {
            updateChat(message);
        })
    
    
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    

    const sendMessage = async (event) => {
        event.preventDefault();
        if (!messageInput.trim()) return;
        
        const newMessage = {
            user: loggedInUser,
            message: messageInput,
            created: new Date().toISOString(),
        };

        // Emit message to server
        socket.emit("send_message", newMessage);
        
        // Update local state
        setMessages([...messages, newMessage]);
        setMessageInput("");
    };

    useEffect(() => {
        // Receive message from server
        socket.on("receive_message", (message) => {
            setMessages([...messages, message]);
        });

        // Clean up
        return () => {
            socket.off("receive_message");
        };
    }, [messages, socket]);

    return (
        <><div style={{ height: "100vh", width: "100%", display: "flex" }}>
            <div className='all-course-side'
                style={{ width: "15%", height: "100vh", backgroundColor: "white", }}>
                <Sidebar />
            </div>
            <div className='all-courses'
                style={{ width: "82%", marginLeft: "1.5%", height: "100vh", display: "flex", flexDirection: "column" }}>
                <Header />
              <a href= "http://localhost:3001/chat">Chatbot</a>
                 <StudentList/> 
                <UserContext.Provider value={{loggedInUser, users, chats, setLoggedInUser}}>
            <Routes>
                <Route path='/chatting' element={<ChatContainer socket={socket} fetchChats={fetchChats}/>}/>
            </Routes>
        </UserContext.Provider>
                </div>
            <div id="chat-box">
                <h2>Chat</h2>
                <div className="message-box">
                    <div className="scroll-to-bottom">
                        {messages.map((message, index) => (
                            <div
                                className={loggedInUser._id === message.user._id ? "you" : "other"}
                                key={index}
                            >
                                <p>{message.message}</p>
                                <p className="message-details">
                                    {loggedInUser._id === message.user._id ? "You" : message.user.username}{" "}
                                    {new Date(message.created).toLocaleTimeString()}
                                </p>
                            </div>
    ))
                    
                        }
                        <div ref={messagesEndRef} />
                    </div>
                    <form id="message-input">
                        <input
                            type="text"
                            placeholder="Type message..."
                            value={messageInput}
                            onChange={handleMessageChange} />
                        <button onClick={sendMessage} type="submit">
                            &#9658;
                        </button>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
};


export default Chats;
