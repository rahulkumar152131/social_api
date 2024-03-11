// Import the PostRepository for handling post-related database operations
import PostRepository from "./post.repository.js";

// Define the PostController class
export default class PostController {
    constructor() {
        this.postRepository = new PostRepository();
    }

    // Controller method for creating a new post
    createPost = async (req, res, next) => {
        try {
            // Extract required information from the request body and user ID from the request
            const { text } = req.body;
            const userID = req.userID;

            // Call the PostRepository to create a new post
            const response = await this.postRepository.createPost(userID, text);

            // Send the response back to the client
            return res.status(201).send(response);
        } catch (err) {
            // Pass the error to the next middleware
            next(err);
        }
    }

    // Controller method for viewing all posts of a user
    viewPost = async (req, res, next) => {
        try {
            // Extract the user ID from the request
            const userID = req.userID;

            // Call the PostRepository to retrieve posts for the specified user
            const response = await this.postRepository.viewPost(userID);

            // Send the response back to the client
            return res.status(201).send(response);
        } catch (err) {
            // Pass the error to the next middleware
            next(err);
        }
    }

    // Controller method for updating a post
    updatePost = async (req, res, next) => {
        try {
            // Extract post ID, text, and user ID from the request parameters and body
            const postID = req.params.id;
            const { text } = req.body;
            const userID = req.userID;

            // Call the PostRepository to update the specified post
            const response = await this.postRepository.updatePost(userID, postID, text);

            // Send the response back to the client
            if (response.success) {
                return res.status(201).send(response);
            } else {
                return res.status(404).send(response);
            }
        } catch (err) {
            // Pass the error to the next middleware
            next(err);
        }
    }

    // Controller method for deleting a post
    deletePost = async (req, res, next) => {
        try {
            // Extract post ID and user ID from the request parameters
            const postID = req.params.id;
            const userID = req.userID;

            // Call the PostRepository to delete the specified post
            const response = await this.postRepository.deletePost(userID, postID);

            // Send the response back to the client
            if (response.success) {
                return res.status(201).send(response);
            } else {
                return res.status(404).send(response);
            }
        } catch (err) {
            // Pass the error to the next middleware
            next(err);
        }
    }

    // Controller method for retrieving the latest posts
    latestPost = async (req, res, next) => {
        try {
            // Extract user ID from the request
            const userID = req.userID;

            // Call the PostRepository to retrieve the latest posts
            const response = await this.postRepository.latestPost(userID);

            // Send the response back to the client
            if (response.success) {
                return res.status(201).send(response);
            } else {
                return res.status(404).send(response);
            }
        } catch (err) {
            // Pass the error to the next middleware
            next(err);
        }
    }
}