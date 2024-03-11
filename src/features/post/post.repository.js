// Import necessary modules and models
import { ApplicationError } from "../../error-handler/applicationError.js";
import userModel from "../user/user.schema.js";
import postModel from "./post.schema.js";

// Define the PostRepository class
export default class PostRepository {
    // Method to create a new post
    async createPost(userID, text) {
        try {
            // Create a new post using the postModel
            const newPost = postModel({ user: userID, text });

            // Save the new post to the database
            await newPost.save();

            // Populate the user details in the post

            // Return the success response with the created post
            return { success: true, msg: 'Post created successfully', res: newPost };

        } catch (err) {
            // Handle errors and throw an application error
            console.log(err);
            throw new ApplicationError('Something went wrong with post database', 500);
        }
    }

    // Method to retrieve all posts
    async viewPost(userID) {
        try {
            // Retrieve all posts from the database and populate user details
            const posts = await postModel.find({ user: userID });

            // Return the success response with the retrieved posts
            return { success: true, msg: 'Posts retrieved successfully', res: posts };

        } catch (err) {
            // Handle errors and throw an application error
            console.log(err);
            throw new ApplicationError('Something went wrong with post database', 500);
        }
    }

    // Method to update a post
    async updatePost(userID, postID, text) {
        try {
            // Find the post to be updated
            const post = await postModel.findOne({ user: userID, _id: postID });

            // Check if the post exists
            if (!post) {
                return { success: false, msg: 'Post not found' };
            }

            // Update the text of the post
            post.text = text;

            // Save the updated post to the database
            await post.save();

            // Return the success response with the updated post
            return { success: true, msg: 'Post updated successfully', res: post };

        } catch (err) {
            // Handle errors and throw an application error
            console.log(err);
            throw new ApplicationError('Something went wrong with post database', 500);
        }
    }

    // Method to delete a post
    async deletePost(userID, postID) {
        try {
            // Find and delete the specified post
            const post = await postModel.findOneAndDelete({ user: userID, _id: postID });

            // Check if the post exists
            if (!post) {
                return { success: false, msg: 'Post not found' };
            } else {
                // Return the success response with the deleted post
                return { success: true, msg: 'Post deleted successfully', res: post };
            }

        } catch (err) {
            // Handle errors and throw an application error
            throw new ApplicationError('Something went wrong with post database', 500);
        }
    }

    // Method to retrieve the latest posts from users that the specified user is following
    async latestPost(userID) {
        try {
            // Find the user by ID
            const user = await userModel.findById(userID);

            // Check if the user exists
            if (!user) {
                return { success: false, msg: 'User not found' };
            }

            // Retrieve the latest posts from users that the specified user is following
            const posts = await postModel.find({ user: { $in: user.following } })
                .sort({ createdAt: -1 })
                .limit(10);

            // Return the success response with the latest posts
            return { success: true, msg: 'Latest posts retrieved successfully', res: posts };

        } catch (err) {
            // Handle errors and throw an application error
            console.log(err);
            throw new ApplicationError('Something went wrong with post database', 500);
        }
    }
}