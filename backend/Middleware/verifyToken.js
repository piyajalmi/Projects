const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expect: 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. Token missing.', success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token Payload:", decoded); // 🐞 Debug: check role and other values
    req.user = decoded; // Attach decoded data to req object
    next(); // Proceed to next middleware/route
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token', success: false });
  }
};

module.exports = verifyToken;
