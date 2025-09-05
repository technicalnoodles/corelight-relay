const authFunctions = require('./auth.js');

// JWT validation middleware
const validateJWTMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ error: 'Missing or invalid authorization header' });
    }
    
    const token = authHeader.split(' ')[1];
    const validation = await authFunctions.validateJWT(token);
    
    if (!validation.valid) {
      return res.status(401).send({ error: 'Invalid token' });
    }
    
    // Attach validation result to request object
    req.authentication = validation;
    next();
  } catch (error) {
    return res.status(401).send({ error: 'Authentication failed' });
  }
};

module.exports = {
  validateJWTMiddleware
};
