import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import TeacherQuizForm from './TeacherQuizForm';
import StudentQuizList from './StudentQuizList';

const QuizForm = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [error, setError] = useState('');
    const userRole = localStorage.getItem("type");

    useEffect(() => {
        if (userRole === 'student') {
            fetchQuestions();
        }
    }, [userRole]);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/questions');
            setQuestions(response.data.questions);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setError('An error occurred while fetching the questions.');
        }
    };

    const handleAnswerSubmit = async (questionId, answer) => {
        try {
            await axios.post(`http://localhost:5001/api/questions/${questionId}/answers`, { answer });
            alert('Answer submitted successfully!');
        } catch (error) {
            console.error('Error submitting answer:', error);
            setError('An error occurred while submitting the answer.');
        }
    };

    const addQuestion = () => {
        setQuestions([...questions, newQuestion]);
        setNewQuestion('');
    };

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:5001/api/questions', { questions });
            alert('Quiz submitted successfully!');
        } catch (error) {
            console.error('Error submitting quiz:', error);
            setError('An error occurred while submitting the quiz.');
        }
    };

    return (
        <div>
            <div style={{ height: "100vh", width: "100%", display: "flex" }}>
                <div
                    className="all-course-side"
                    style={{ width: "15%", height: "100vh", backgroundColor: "white" }}>
                    <Sidebar />
                </div>
                <div
                    style={{ width: "82%", marginLeft: "1.5%", height: "100vh", display: "flex", flexDirection: "column" }}>
                    <Header />
                   
                    {error && <p>Error: {error}</p>}
                    {userRole === 'teacher' && (
                        <TeacherQuizForm/>
                    )}
                    {userRole === 'student' && (
                        <StudentQuizList/>
                    )}
                    {userRole === 'admin' && (
                        <TeacherQuizForm/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizForm;
