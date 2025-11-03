const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  studentName: String,
  projectName: String,
  description: String,
  techStack: String,
  github: String,
  hosted: String,
  linkedin: String,
  courseName: String,
  courseCode: String,
  facultyName: String,
  thumbnailUrl: String,
  fileUrl: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('projects', ProjectSchema);
