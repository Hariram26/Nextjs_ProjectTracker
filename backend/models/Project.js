const mongoose = require('mongoose');

const AiTaskSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  priority: String,
  category: String,
  isCompleted: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const AttachmentSchema = new mongoose.Schema({
  id: String,
  name: String,
  size: String,
  date: String
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Todo', 'In Progress', 'Completed'],
    default: 'Todo'
  },
  notes: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  aiTasks: [AiTaskSchema],
  attachments: [AttachmentSchema],
  createdAt: {
    type: String,
    default: () => new Date().toLocaleDateString()
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
