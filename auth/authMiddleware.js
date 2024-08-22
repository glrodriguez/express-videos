import jwt from 'jsonwebtoken';
import config from '../src/config.js';


export default async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(403).json({ message: "Access not authorized" });
  }

  try {
    const data = jwt.verify(token, config.jwt_key);
    if (data) {
      return next();
    }
  } catch (error) {
    res.status(401).json({ message: "Access not authorized" });
  }
};
