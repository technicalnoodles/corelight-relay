const axios = require('axios');
const https = require('https');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// JWKS client configuration
// TODO: Replace with correct JWKS endpoint URL
const client = jwksClient({
  jwksUri: 'https://visibility.amp.cisco.com/.well-known/jwks',
  requestHeaders: {}, // Optional
  timeout: 30000, // Defaults to 30s
});

// Function to get signing key from JWKS
const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('JWKS key lookup failed:', {
        kid: header.kid,
        error: err.message,
        jwksUri: 'https://visibility.amp.cisco.com/.well-known/jwks'
      });
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

// Function to validate JWT token with proper verification
const validateJWT = async function (token) {
  try {
    // First decode token to inspect header and payload
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader) {
      throw new Error('Invalid JWT token format');
    }
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, {
        algorithms: ['RS256'],
        issuer: 'IROH Int'
      }, (err, decoded) => {
        if (err) {
          console.error('JWT verify error details:', {
            name: err.name,
            message: err.message,
            kid: decodedHeader.header.kid
          });
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
    
    return {
      valid: true,
      payload: decoded,
      corelight_host: decoded.corelight_host,
      token: `Bearer ${decoded.token}`
    };
    
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
};

module.exports = {
  validateJWT,
  getAuthHeaders: async function (headers) {
    const authHeader = headers;

    // Check if it's a Bearer token (JWT)
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const auth_info = {
        corelight_host: '',
        token: ''
      }
        
      try {
        const decoded = jwt.decode(token, { complete: true });
        if (!decoded) {
          return false;
        }
        auth_info.corelight_host = decoded.payload.corelight_host;
        auth_info.token = `Bearer ${decoded.payload.token}`;
        return auth_info;
        
      } catch (error) {
        return false;
      }
    }
    
    // Handle Basic Auth (existing logic)
    else if (authHeader.startsWith('Basic ')) {
      const auth = new Buffer.from(authHeader.split(' ')[1], 'base64')
        .toString()
        .split(':');
      const user = auth[0];
      const pass = auth[1];
      return { type: 'basic', user: user, pass: pass };
    }
    
    else {
      return {type: 'Unsupported authentication method'};
    }
  },
};
