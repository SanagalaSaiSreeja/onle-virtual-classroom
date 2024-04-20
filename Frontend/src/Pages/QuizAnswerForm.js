import React, { useState } from 'react';
import axios from 'axios';
import './QuizAnswerForm.css'; // Import CSS file for styling

const QuizAnswerForm = ({ quiz }) => {
    const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(''));
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);
    const [score, setScore] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const Id = localStorage.getItem('userId');
    const name = localStorage.getItem('username');

    const handleAnswerChange = (index, event) => {
        const newAnswers = [...answers];
        newAnswers[index] = event.target.value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/questions/evaluate', {
                quizId: quiz._id,
                answers
            });

            const { results, score, totalQuestions, percentage } = response.data;
            setResults(results);
            setScore(score);
            setPercentage(percentage);
            setSubmitted(true);
            const sub = await axios.post('http://localhost:5001/api/questions/submit', {
                quizId: quiz._id,
                studentId: Id,
                score: score,
                StudentName: name
            });
        } catch (error) {
            console.error('Error submitting quiz answers:', error);
        }
    };

    return (
        <div className="quiz-answer-form">
            <h2>{quiz.title}</h2>
            <form onSubmit={handleSubmit}>
                {quiz.questions.map((question, index) => (
                    <div className="question-container" key={index}>
                        <p className="question">{question.question}</p>
                        <input
                            className="answer-input"
                            type="text"
                            value={answers[index]}
                            onChange={(e) => handleAnswerChange(index, e)}
                        />
                    </div>
                ))}
                <button className="submit-button" type="submit">Submit Quiz</button>
            </form>
            {submitted && results && (
                <div className="quiz-results">
                    <h3>Quiz Results</h3>
                    <p>Score: {score} / {quiz.questions.length}</p>
                    <p>Percentage: {percentage}%</p>
                    <ul>
                        {results.map((result, index) => (
                            <li className="result-item" key={index}>
                                <p>Question: {result.question}</p>
                                <p>Your Answer: {result.studentAnswer}</p>
                                <p>Correct Answer: {result.correctAnswer}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default QuizAnswerForm;
