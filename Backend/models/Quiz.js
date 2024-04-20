// models/Quiz.js
const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    questions: [{
        question: String,
        correctAnswer: String
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Addstudents' // Assuming this is the correct reference
    },
    studentResults: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Addstudents' // Assuming this is the correct reference
        },
        score: Number,
        StudentName:String
        // Other relevant details
    }]
});

module.exports = mongoose.model('Quiz', QuizSchema);
