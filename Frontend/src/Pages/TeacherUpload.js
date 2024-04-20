// TeacherClient/src/App.js

import React, { useState } from 'react';
import axios from 'axios';

function TeacherUpload() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };
const id=localStorage.getItem("userId");
const name=localStorage.getItem("username");
    const handleUpload = () => {
        const formData = new FormData();
        formData.append('video', selectedFile);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('teacher',id);
        formData.append('teacherName',name)

        axios.post('http://localhost:5001/api/upload/teacher', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log(response.data);
            alert(response.data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error uploading video');
        });
    };

    return (
        <div>
           <center><h1>Upload Course Video or Recording Session</h1></center>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /><br></br>
            <br></br><textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <input type="file" accept="video/*" onChange={handleFileChange} /><br></br>
            <br></br><button onClick={handleUpload}>Upload Video</button>
        </div>
    );
}

export default TeacherUpload;
