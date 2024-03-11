// Import the Mongoose library for MongoDB interactions
import mongoose from "mongoose";

// Define the schema for the 'posts' collection
const postSchema = new mongoose.Schema({
    // Reference to the user who created the post
    user: {
        type: String,
        ref: 'users'
    },
    // Text content of the post, required field
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true }); // Enable timestamps to automatically record creation and update times

// Create a Mongoose model for the 'posts' collection using the defined schema
const postModel = mongoose.model("posts", postSchema);

// Export the postModel for use in other parts of the application
export default postModel;