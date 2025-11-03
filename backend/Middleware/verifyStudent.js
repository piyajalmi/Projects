const verifyStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next(); // Allow access
  } else {
    return res.status(403).json({ message: 'Access denied: Students only', success: false });
  }
};

module.exports = verifyStudent;
