
const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// Create a new quiz
router.post('/', async (req, res) => {
  try {
    const { title, questions, createdBy } = req.body;

    const quiz = new Quiz({
      title,
      questions,
      createdBy,
      studentResults: [] // Initialize studentResults array
    });
    await quiz.save();

    res.status(201).json({ success: true, quiz });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ success: false, error: 'An error occurred while creating the quiz.' });
  }
});




router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ success: false, error: 'An error occurred while fetching quizzes.' });
  }
});

router.post('/evaluate', async (req, res) => {
  try {
      const { quizId, answers } = req.body;

      // Fetch the quiz from the database
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
          return res.status(404).json({ success: false, error: 'Quiz not found' });
      }

      // Evaluate answers and calculate score
      let score = 0;
      const results = answers.map((studentAnswer, index) => {
          const correctAnswer = quiz.questions[index].correctAnswer;
          if (studentAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
              score++;
          }
          return {
              question: quiz.questions[index].question,
              studentAnswer,
              correctAnswer
          };
      });

      const totalQuestions = quiz.questions.length;
      const percentage = (score / totalQuestions) * 100;

      res.status(200).json({ success: true, results, score, totalQuestions, percentage });
  } catch (error) {
      console.error('Error evaluating quiz answers:', error);
      res.status(500).json({ success: false, error: 'An error occurred while evaluating quiz answers.' });
  }
});

router.post('/submit', async (req, res) => {
  try {
      const { quizId, studentId, score,StudentName } = req.body;
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
          return res.status(404).json({ success: false, error: 'Quiz not found' });
      }
      quiz.studentResults.push({StudentName, score,studentId });
      await quiz.save();
      res.status(200).json({ success: true });
  } catch (error) {
      console.error('Error storing student results:', error);
      res.status(500).json({ success: false, error: 'An error occurred while storing student results.' });
  }
});

// Retrieve Quiz Results
router.get('/:quizId/results', async (req, res) => {
  try {
      const quizId = req.params.quizId;
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
          return res.status(404).json({ success: false, error: 'Quiz not found' });
      }
      res.status(200).json({ success: true, results: quiz.studentResults });
  } catch (error) {
      console.error('Error retrieving quiz results:', error);
      res.status(500).json({ success: false, error: 'An error occurred while retrieving quiz results.' });
  }
});

router.get('/evaluate', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ success: false, error: 'An error occurred while fetching quizzes.' });
  }
});


module.exports = router;
