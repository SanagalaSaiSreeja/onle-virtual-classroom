// models/Assignment.js

const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref: 'Addstudents', // Reference to the Addstudents model to store the ID of the user who created the assignment
  },
  submission: {
    type: String, // For simplicity, storing submission as a string. You can adjust this as needed.
    default: '' // Initial value for submission
  },
  submittedBy: {
    type: String
     // Reference to the Addstudents model to store the ID of the user who submitted the assignment
  },
  filename: {
    type:String},
  mimetype: {type:String},
  filePath: {type:String}
});


const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
