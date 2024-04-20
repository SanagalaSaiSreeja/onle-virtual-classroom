// StudentUpload.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentUpload() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5001/api/upload/teacher/videos')
            .then(response => {
                setVideos(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error fetching videos');
            });
    }, []);

    return (
        <div>
            <center><h1>Video Viewer</h1></center>
            <ul  style={{ display: 'flex', flexWrap: 'wrap', listStyleType: 'none', padding: 0 }}>
                {videos.map(video => (
                    <li key={video._id}  style={{ width: 'calc(50% - 20px)', padding: '10px', margin: '10px' }}>
                        <video controls width="320" height="240">
                            <source src={`http://localhost:5001/api/upload/teacher/videos/${video.filename}`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <p>Title: {video.title}</p>
                        <p>Description: {video.description}</p>
                        <p>Uploaded by: {video.teacherName}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StudentUpload;
