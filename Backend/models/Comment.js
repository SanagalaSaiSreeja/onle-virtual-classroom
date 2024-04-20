// commentModel.js

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  content: {type:String,
            required: true,
            default:"Okk fine"
}
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
