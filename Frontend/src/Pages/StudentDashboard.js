import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeacherDashboard.css';

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [comments, setComments] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/assignments');
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, []);

  const fetchComments = async (assignmentId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/assignments/${assignmentId}/comments`);
      return response.data || null; // Return comment data if available, otherwise return null
    } catch (error) {
      console.error('Error fetching comments:', error);
      return null; // Return null in case of an error
    }
  };

  const fetchAllComments = async () => {
    const commentsMap = {};
    for (const assignment of assignments) {
      const comments = await fetchComments(assignment._id);
      commentsMap[assignment._id] = comments;
    }
    setComments(commentsMap);
  };

  useEffect(() => {
    fetchAllComments();
  }, [assignments]);

  const id = localStorage.getItem("userId");
  const name = localStorage.getItem("username");
  const type = localStorage.getItem("type");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      console.error('No file selected.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('file', file);
      formData.append('createdBy', id);
      formData.append('submission', name);
      formData.append('submittedBy', type);

      const response = await axios.post('http://localhost:5001/api/assignments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Assignment submitted:', response.data);
      // Optionally: Show success message or redirect to another page
    } catch (error) {
      console.error('Error submitting assignment:', error);
      // Optionally: Show error message to the user
    }
  };

  return (
    <div className="teacher-dashboard-container">
      <div className="assignments-list-container">
      <h2>Submit new Assignment</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <input type="file" onChange={handleFileChange} />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="assignments-list-container">
        <h3>Assignments</h3>
        <ul>
                        {assignments.map((assignment) => (
                        assignment.submittedBy === 'teacher' && (
                          <li className="assignment-item" key={assignment._id}>
                          <strong>{assignment.title}</strong>:{assignment.description}<br></br>
                          {assignment.submission && (
                            <>
                              Assignment Created by: {assignment.submission}<br></br>
                            </>
                          )}
                          {assignment.filename && (
                            <a style={{
                              height: "35px",
                              width: "50%",
                              border: "none",
                              backgroundColor: "black",
                              color: "white",
                              borderRadius: 8, // Increase the border radius for more rounded corners
                              padding: "10px 20px", // Add padding to create space around the text
                              
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              textDecoration: "none", // Remove underline for links
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            }} className="download-link" href={`http://localhost:5001/api/assignments/${encodeURIComponent(assignment.filename)}`} download>   Download File </a>
                          )}
                        </li>
                          )
                        ))}
        </ul>
        <h3>My Submissions</h3>
  <ul>
    {assignments.map((assignment) => (
      assignment.submission== name && (
       
          <li className="assignment-item" key={assignment._id}>
          <strong>{assignment.title}</strong>:{assignment.description}<br></br>
          {assignment.filename && (
                            <a style={{
                              height: "35px",
                              width: "50%",
                              border: "none",
                              backgroundColor: "black",
                              color: "white",
                              borderRadius: 8, // Increase the border radius for more rounded corners
                              padding: "10px 20px", // Add padding to create space around the text
                              
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              textDecoration: "none", // Remove underline for links
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            }} className="download-link" href={`http://localhost:5001/api/assignments/${encodeURIComponent(assignment.filename)}`} download>   Download File </a>
                          )}
                          <h5>Comments:</h5> <p>{comments[assignment._id] && comments[assignment._id].map(comment => comment.content).join(', ')}</p>
                        
        </li>
      )
    ))}
  </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
