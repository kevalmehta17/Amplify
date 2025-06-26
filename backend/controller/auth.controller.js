import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const signToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d", // Token will expire in 7 days
    })
}

export const signup = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        // validate the email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check all the fields are provided
        if (!email || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // create a new user 
        const newUser = await User.create({
            email,
            username,
            password
        });

        // create the token
        const token = signToken(newUser._id);

        // set the token in the response header
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "Strict", // Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000 // Token will expire in 7 days
        })

        res.status(201).json({
            message: "User created successfully",
            user: { ...newUser._doc, password: undefined },
            token: token
        });
    } catch (error) {
        console.error(`Error during signup: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // check if the email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        // find the user by email
        const user = await User.findOne({ email }).select("+password"); // Include password field for comparison
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // compare the password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        // create the token
        const token = signToken(user._id);
        // set the token in the response header
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "Strict", // Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000 // Token will expire in 7 days
        });
        res.status(200).json({
            message: "Login successful",
            user: { ...user._doc, password: undefined }, // Exclude password from response
            token: token
        });
    } catch (error) {
        console.error(`Error during login: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const logout = async (req, res) => {
    try {
        // Clear the token cookie
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "Strict", // Prevent CSRF attacks
            maxAge: 0 // Set maxAge to 0 to delete the cookie
        });
        res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        console.error(`Error during logout: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });

    }
}