// StudentQuizList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuizAnswerForm from './QuizAnswerForm';
import './StudentQuizList.css'; // Import CSS file for styling

const StudentQuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/questions');
            setQuizzes(response.data.quizzes);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    const handleQuizClick = (quiz) => {
        setSelectedQuiz(quiz);
    };

    return (
        <div className="student-quiz-list">
            <h2>Available Quizzes</h2>
            <ul className="quiz-list">
                {quizzes.map((quiz, index) => (
                    <li key={index} onClick={() => handleQuizClick(quiz)}>
                        <p>{quiz.title}</p>
                    </li>
                ))}
            </ul>
            {selectedQuiz && <QuizAnswerForm quiz={selectedQuiz} />}
        </div>
    );
};

export default StudentQuizList;
