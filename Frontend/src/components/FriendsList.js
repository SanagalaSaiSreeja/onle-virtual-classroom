import "./FriendsList.css";
import React, { useEffect, useState } from "react";
import Sidebar from "../Pages/Sidebar";
import Header from "../Pages/Header";
import { json, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../Pages/BaseUrl";

const FriendsList = ({friends, filteredChats, currentFriendChat, deleteFriend}) => {
    const [noti1, setNoti1] = useState(false);
    const [noti, setNoti] = useState(false);

    useEffect(() => {
        getStudentData();
    }, []);

    const getStudentData = async () => {
        try {
            const response = await axios.get(baseUrl + "addstudents");
            if (!response.data.success) {
                throw new Error('Failed to fetch students');
            }
            const studentNames = response.data.data.map(student => student.name);
            console.log('Student names:', studentNames);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleClick = friend => {
        deleteFriend(friend)
    }

    const friendsList = friends && friends.map(friend => {
        const chat = filteredChats.find(chat => chat.addstudents);
        
        return (
            <li key={friend._id}>
                <p onClick={() => currentFriendChat(chat)}>{friend.name}</p>
                <button onClick={() => handleClick(friend)}>&#128465;</button>
            </li>
        );
    });
        
    return (
        <div id="friends-list-div">
            <h3>Friends</h3>
            <div className="all-courses-1"
                style={{
                    width: "100%",
                    minHeight: "73vh",
                    backgroundColor: "white",
                    alignItems: "center",
                    display: "flex",
                    flexWrap:"wrap",
                    gap: "2%",
                    
                }}
            >
                <div className="lgnd1"
                    style={{ height: "70vh", width: "45%", textAlign: "center", }}
                >
                    <label></label>
                    <div
                        style={{
                            height: "70vh",
                            width: "100%",
                            backgroundColor: "white",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            paddingTop: "10px",
                            overflowY: "auto",
                        }}
                    >
                        {friendsList}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FriendsList;
