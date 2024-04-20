const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const multer = require('multer'); // For handling multipart/form-data (file uploads)
const fs = require('fs');
const path = require('path');
const Comment = require('../models/Comment');

// Route to create a new assignment (only accessible to teachers)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    // Extract form data from request body
    const { filename, mimetype, path: filePath } = req.file;
    const { title, description,createdBy,submission,submittedBy } = req.body;
    
    const assignment = new Assignment({
      title,
      description,
      createdBy,
      submission,
      submittedBy,
      filename,
      mimetype,
      filePath
    });
    const savedAssignment = await assignment.save();

    res.status(201).json(savedAssignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'An error occurred while creating the assignment. Please try again later.' });
  }
});

// Route to fetch assignments (accessible to both teachers and students)
router.get('/', async (req, res) => {
  try {
    // Fetch assignments from the database
    const assignments = await Assignment.find();

    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'An error occurred while fetching assignments. Please try again later.' });
  }
});

router.post('/:assignmentId/comments', async (req, res) => {
  const { assignmentId } = req.params;
  const { content } = req.body;

  try {
    const comment = new Comment({ assignmentId, content });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch comments for a specific assignment
router.get('/:assignmentId/comments', async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const comments = await Comment.find({ assignmentId });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to submit an assignment (accessible to students)
router.post('/submit', async (req, res) => {
  try {
    // Extract assignment submission data from request body
    const { assignmentId, submission } = req.body;
    // Assuming user ID is available in req.user._id after authentication
    const submittedBy = req.user._id;

    // Update the assignment with the submission data
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { $set: { submission: submission, submittedBy: submittedBy } },
      { new: true }
    );

    res.status(200).json(updatedAssignment);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ error: 'An error occurred while submitting the assignment. Please try again later.' });
  }
});

router.get('/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '../uploads', fileName);

  // Send the file as an attachment
  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(404).send('File not found');
    }
  });
});

module.exports = router;
