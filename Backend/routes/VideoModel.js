// server.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const fs=require('fs')

const Video = require('../models/VideoModel');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Upload route for teachers
router.post('/', upload.single('video'), (req, res) => {
    const { title, description,teacher,teacherName } = req.body;
    const { filename, path } = req.file;

    // Create a new video document using the Video model
    const newVideo = new Video({
        title,
        description,
        filename,
        path,
        teacher,
        teacherName// Assuming you have authentication middleware that sets req.user
    });

    // Save the video to the database
    newVideo.save()
        .then(video => {
            res.json({ success: true, message: 'Video uploaded successfully by teacher', video });
        })
        .catch(error => {
            console.error('Error saving video:', error);
            res.status(500).json({ success: false, message: 'Error uploading video' });
        });
});

// Route to fetch videos uploaded by teachers
router.get('/videos', (req, res) => {
    Video.find({}, (err, videos) => {
        if (err) {
            console.error('Error fetching videos:', err);
            res.status(500).json({ success: false, message: 'Error fetching videos' });
        } else {
            res.json(videos);
        }
    });
});
router.get('/videos/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
        const chunksize = (end-start)+1;
        const file = fs.createReadStream(filePath, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
});

module.exports = router;
