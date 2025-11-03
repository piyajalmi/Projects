const { 
  studentSignupValidation, 
  adminSignupValidation, 
  loginValidation 
} = require('../Middleware/AuthValidation');

const { signup, login, registerAdmin } = require('../Controllers/AuthController');
const router = require('express').Router();

// 🧑‍🎓 Student
router.post('/signup', studentSignupValidation, signup);
router.post('/login', loginValidation, login);

// 🧑‍💼 Admin
router.post('/admin-signup', adminSignupValidation, registerAdmin);

module.exports = router;
