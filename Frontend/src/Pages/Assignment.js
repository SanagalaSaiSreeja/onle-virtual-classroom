// frontend/src/components/AssignmentForm.js

import React, { useState } from 'react';
import axios from 'axios';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import Sidebar from './Sidebar';
import Header from './Header';

const Assignment = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = { title, description };

      const response = await axios.post('http://localhost:5001/api/assignments', formData);
      console.log('Assignment submitted:', response.data);
      // Optionally: Show success message or redirect to another page
    } catch (error) {
      console.error('Error submitting assignment:', error);
      // Optionally: Show error message to the user
    }
  };
 const type=localStorage.getItem("type")
  return (
    <div> 
        {type==="student"?
    <div style={{height:"100vh", width:"100%",display:"flex"}}>
        <div
        className="all-course-side"
         style={{width:"15%", height:"100vh", backgroundColor:"white",}}>
            <Sidebar/>
        </div>
        <div  
         style={{width:"82%",marginLeft:"1.5%", height:"100vh", display:"flex", flexDirection:"column"}}>
            <Header/>
            <StudentDashboard/>
        </div>
    </div>:
     <div style={{height:"100vh", width:"100%",display:"flex"}}>
     <div
     className="all-course-side"
      style={{width:"15%", height:"100vh", backgroundColor:"white",}}>
         <Sidebar/>
     </div>
     <div  
      style={{width:"82%",marginLeft:"1.5%", height:"100vh", display:"flex", flexDirection:"column"}}>
         <Header/>
         <TeacherDashboard/>
     </div>
 </div>
}
  
  </div>
  )
}
export default Assignment;
