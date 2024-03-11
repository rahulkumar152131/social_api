// Import necessary modules and the PostController
import express from 'express';
import PostController from './post.controller.js';

// Create an Express router
const postRouter = express.Router();

// Instantiate a new PostController
const postController = new PostController();

// Define routes for post-related operations

// Route to create a new post
postRouter.post('/create-post', postController.createPost);

// Route to view all posts
postRouter.get('/view-post', postController.viewPost);

// Route to update a post by ID
postRouter.put('/update-post/:id', postController.updatePost);

// Route to delete a post by ID
postRouter.delete('/delete-post/:id', postController.deletePost);

// Route to retrieve the latest posts
postRouter.get('/latest-post', postController.latestPost);

// Export the postRouter for use in the main application
export default postRouter;