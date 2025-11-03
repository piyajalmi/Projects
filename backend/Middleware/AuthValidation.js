const Joi = require('joi');

// Student Signup Validation
const studentSignupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Confirm password must match password'
    }),
    yearOfStudy: Joi.string().valid('1st', '2nd').required(), // ✅ Required for students
    gender: Joi.string().valid('Male', 'Female', 'Other').required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Bad request", error });
  next();
};

// Admin Signup Validation
const adminSignupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Confirm password must match password'
    })
    // ⛔️ No yearOfStudy or gender here
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Bad request", error });
  next();
};

// Common Login Validation
const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: "Bad request", error });
  next();
};

module.exports = {
  studentSignupValidation,
  adminSignupValidation,
  loginValidation
};
