import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/user.model.js';

dotenv.config();

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized access, token missing" });
        }
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized access, invalid token" });
        }

        // Check if the user ID exists in the decoded token
        const currentUserId = await User.findById(decoded.userId);
        if (!currentUserId) {
            return res.status(401).json({ message: "Unauthorized access, user not found" });
        }

        // Attach the user to the request object
        req.user = currentUserId;
        console.log(`User authenticated: ${req.user._id}`);
        // Call the next middleware or route handler
        next();


    } catch (error) {
        console.error(`Error in protectRoute middleware: ${error.message}`);
        res.status(401).json({ message: "Unauthorized access" });
    }
}

export default protectRoute;