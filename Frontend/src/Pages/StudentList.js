import React, { useState } from "react";
import axios from "axios";

const StudentList = () => {
  const [studentNames, setStudentNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStudentNames = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5001/api/addstudents");
      const students = response.data.data;
      const names = students.map(student => student.name);
      setStudentNames(names);
    } catch (error) {
      console.error('Error fetching student names:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchStudentNames} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Fetch Student Names'}
      </button>
      {studentNames.length > 0 && (
        <ul>
          {studentNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentList;
