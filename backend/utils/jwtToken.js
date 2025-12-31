import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

const generateToken = (id,company_id,role,company_name) => {
    const token = jwt.sign(
        {
            id,
            company_id,
            role,
            company_name
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY
        }
    )
    return token
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export {generateToken,verifyToken}