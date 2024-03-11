// Import necessary modules
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

// Define user schema
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        select: false,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    profileImage: {
        type: String,
    },
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
});

// Define a toJSON method to exclude sensitive information (password) from the response
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

// Create and export the user model
const userModel = mongoose.model("users", userSchema);
export default userModel;