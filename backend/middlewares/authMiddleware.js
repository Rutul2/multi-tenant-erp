import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Remember the .js extension!

export const protect = async (req, res, next) => {
  let token;

  // 1. Check if the token exists in the headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token (Format: "Bearer abcdef12345...")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user in the database (excluding the password)
      req.user = await User.findById(decoded.id).select('-password');

      // Ensure the user actually exists and has a tenantId
      if (!req.user || !req.user.tenantId) {
        return res.status(401).json({ message: 'Not authorized, invalid tenant data' });
      }

      // 4. Move to the next function (the controller)
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Optional but highly recommended: Role-based protection
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role (${req.user.role}) is not allowed to access this resource` 
      });
    }
    next();
  };
};