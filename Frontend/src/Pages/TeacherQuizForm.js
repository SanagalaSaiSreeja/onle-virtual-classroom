import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeacherDashboard.css';

const TeacherQuizForm = () => {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([{ questionText: '', correctAnswer: '' }]);
    const [createdBy, setCreatedBy] = useState(""); // Added createdBy state
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizResults, setSelectedQuizResults] = useState([]);

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

    const handleAddQuestion = () => {
        setQuestions([...questions, { questionText: '', correctAnswer: '' }]);
    };

    const handleSubmit = async () => {
        try {
            // Extract questions from the state
            const questionsData = questions.map(({ questionText, correctAnswer }) => ({ question: questionText, correctAnswer }));

            // Get createdBy from localStorage
            const createdBy = localStorage.getItem("userId");

            // Send quiz data to the backend
            await axios.post('http://localhost:5001/api/questions', { title, questions: questionsData, createdBy });
            alert('Quiz created successfully!');

            // Reset form fields after successful submission
            setTitle('');
            setQuestions([{ questionText: '', correctAnswer: '' }]);
            fetchQuizzes(); // Fetch quizzes again to update the list
        } catch (error) {
            console.error('Error creating quiz:', error);
            alert('An error occurred while creating the quiz.');
        }
    };

    const handleChangeQuestion = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleViewResults = async (quizId) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/questions/${quizId}/results`);
            setSelectedQuizResults(response.data.results);
        } catch (error) {
            console.error('Error fetching quiz results:', error);
            alert('An error occurred while fetching quiz results.');
        }
    };

    return (
      
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 auto', maxWidth: '1200px', padding: '20px' }}>
                <div style={{ flex: 1, marginRight: '20px', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}>
                    <h2>Create Quiz</h2>
                    <input type="text" placeholder="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ marginBottom: '10px', width: '100%' }} />
                    {questions.map((question, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <input type="text" placeholder={`Question ${index + 1}`} value={question.questionText} onChange={(e) => handleChangeQuestion(index, 'questionText', e.target.value)} style={{ width: 'calc(50% - 10px)', marginRight: '10px' }} />
                            <input type="text" placeholder="Correct Answer" value={question.correctAnswer} onChange={(e) => handleChangeQuestion(index, 'correctAnswer', e.target.value)} style={{ width: 'calc(50% - 10px)' }} />
                        </div>
                    ))}
                    <button onClick={handleAddQuestion} style={{ marginBottom: '10px' }}>Add Question</button>
                    <button onClick={handleSubmit}>Create Quiz</button>
                    
                </div>

                <div style={{ flex: 1, border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}>
                    {/* Display quizzes and option to view results */}
                    <div>
                        <h2>Teacher Quiz Results</h2>
                        <h3>Quizzes</h3>
                        <ul>
                            {quizzes.map((quiz, index) => (
                                <li key={index} style={{ marginBottom: '5px' }}>
                                    {quiz.title} 
                                    <button onClick={() => handleViewResults(quiz._id)} style={{ marginLeft: '10px' }}>View Results</button>
                                    {setSelectedQuizResults.StudentName}
                                </li>
                            ))}
                        </ul>
                        {selectedQuizResults.length > 0 ? (
                            <div>
                                <h3>Results for {selectedQuizResults[0].quizTitle}</h3>
                                <ul>
                                    {selectedQuizResults.map((result, index) => (
                                        <li key={index} style={{ marginBottom: '5px' }}>
                                            <p>Student Name: {result.StudentName}</p>
                                            <p>Score: {result.score}</p>
                                            {/* Display other relevant details */}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>No results available for the selected quiz.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherQuizForm;
