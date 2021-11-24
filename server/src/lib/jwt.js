import jsonwebtoken from 'jsonwebtoken';
import Logger from './logger.js';

const logger = Logger('lib/jwt');
const { verify } = jsonwebtoken;

export const TOKEN_KEY = '4DdiFCXi6Pk7mb6HAj9MWg3sW0aG_bMHWLYGRTE8U5NqZLQN4uRxUufaZ5suOl3njIKhhauWnPYiVDxUKH_';

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    logger.info('Token missing');
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const decoded = verify(token, TOKEN_KEY);
    logger.info('decoded token');
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};

export default verifyToken;
