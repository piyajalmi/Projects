const router = require('express').Router();
const verifyToken = require('../Middleware/verifyToken');
const verifyStudent = require('../Middleware/verifyStudent');
const { upload, uploadProject } = require('../Controllers/ProjectController');

// POST route for project upload
router.post('/submit', verifyToken, verifyStudent, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), uploadProject);

module.exports = router;
