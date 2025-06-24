import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum length for password
    }
}, { timestamps: true });

// Hash the password before saving

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();

    } catch (error) {
        console.error(`Error hashing password: ${error}`);
        return next(error);
    }
})

// Method to compare the password

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);

    } catch (error) {
        console.error(`Error comparing password: ${error}`);
        throw error;
    }
}

const User = mongoose.model("User", userSchema);

export default User;