// backend/routes/fileRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer'); // For handling multipart/form-data (file uploads)
const fs = require('fs');
const path = require('path');
const File = require('../models/File');

// Configure multer storage
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

// POST endpoint for file upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { filename, mimetype, path: filePath } = req.file;
    const file = new File({
      filename,
      mimetype,
      filePath
    });
    const savedFile = await file.save();
    res.status(201).json(savedFile);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'An error occurred while uploading the file.' });
  }
});

module.exports = router;
