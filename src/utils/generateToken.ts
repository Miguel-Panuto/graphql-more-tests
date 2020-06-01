
import jwt from 'jsonwebtoken';
var authConfig = require('../config/auth');

// This will generate a new token to maintain the session in 1 day
const generateToken = (params = {}) => {
    return jwt.sign(params, process.env.AUTH || authConfig.secret, {
        expiresIn: 86400,
    });
}

export default generateToken;