import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
  // Check for token in header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication invalid' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwtsecret');
    
    // Attach user to request object
    req.user = {
      userId: decoded.userId,
      name: decoded.name,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication invalid' });
  }
};

export default authenticateUser;