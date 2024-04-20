import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState(''); // State for comment

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

  const addComment = async (assignmentId, commentText) => {
    try {
      const response = await axios.post(`http://localhost:5001/api/assignments/${assignmentId}/comments`, { content: commentText });
      console.log('Comment added:', response.data);
  
      // Update comments state to include the newly added comment for the specific assignment
      setComments(prevComments => ({
        ...prevComments,
        [assignmentId]: [...(prevComments[assignmentId] || []), response.data]
      }));
      setComments('');
    } catch (error) {
      console.error('Error adding comment:', error);
      // Optionally: Show error message to the user
    }
  };

  return (
    <div className="teacher-dashboard-container">
      <div className="assignment-form-container">
        <h2>Create New Assignment</h2>
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
    assignment.submittedBy === 'student' && (
    <li className="assignment-item" key={assignment._id}>
      <strong>{assignment.title}</strong>:{assignment.description}<br></br>
      {assignment.submission && (
        <>
          Assignment Submitted by: {assignment.submission}<br></br>
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
        }}className="download-link" href={`http://localhost:5001/api/assignments/${encodeURIComponent(assignment.filename)}`} download>Download File</a>
      )}<br></br>
      <textarea
              value={comments[assignment._id] || ''} // Retrieve comments for the specific assignment
              onChange={(e) => setComments({ ...comments, [assignment._id]: e.target.value })} // Update comments state with the newly typed comment for the specific assignment
              placeholder="Add comment..."
            ></textarea>
            <button onClick={() => addComment(assignment._id, comments[assignment._id])}>Add Comment</button>
    </li>
  )
))}
          
        </ul>
      </div>
    </div>

  );
};

export default TeacherDashboard;
