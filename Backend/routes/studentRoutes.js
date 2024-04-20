// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// Route to submit an assignment
router.post('/assignments/:assignmentId/submit', async (req, res) => {
  try {
    if (req.user.type !== 'student') {
      return res.status(403).json({ error: 'Unauthorized. Only students can submit assignments.' });
    }

    const { assignmentId } = req.params;
    const { submissionText } = req.body;
    const studentId = req.user._id;
    
    const submission = new Submission({
      student: studentId,
      assignment: assignmentId,
      submissionText
    });

    const savedSubmission = await submission.save();
    res.status(201).json(savedSubmission);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ error: 'An error occurred while submitting the assignment' });
  }
});

// Route to get assignments available for students
router.get('/assignments', async (req, res) => {
  try {
    if (req.user.type !== 'student') {
      return res.status(403).json({ error: 'Unauthorized. Only students can view assignments.' });
    }

    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'An error occurred while fetching assignments' });
  }
});

module.exports = router;
