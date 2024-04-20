const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// Route to create a new assignment
router.post('/assignments', async (req, res) => {
  try {
    // Ensure user is authenticated and is a teacher
    if (!req.user || req.user.type !== 'teacher') {
      return res.status(403).json({ error: 'Unauthorized. Only teachers can create assignments.' });
    }

    // Extract assignment data from request body
    const { title, description } = req.body;

    // Validate input data
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required fields.' });
    }

    // Get user ID of the teacher creating the assignment
    const createdBy = req.user._id;

    // Create a new assignment instance
    const assignment = new Assignment({ title, description, createdBy });

    // Save the assignment to the database
    const savedAssignment = await assignment.save();

    // Return the created assignment in the response
    res.status(201).json(savedAssignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    // Handle different types of errors appropriately
    if (error.name === 'ValidationError') {
      // Handle validation errors
      res.status(400).json({ error: error.message });
    } else {
      // Handle other unexpected errors
      res.status(500).json({ error: 'An error occurred while creating the assignment. Please try again later.' });
    }
  }
});

module.exports = router;
