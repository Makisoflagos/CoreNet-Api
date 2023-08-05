const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log({token})
  if (!token) {
    return res.status(403).json({ message: 'No authorization token found' });
  }

  jwt.verify(token, process.env.secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decodedToken;
    next();
  });
};

module.exports = authenticateToken;