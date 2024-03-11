// Import necessary modules
import express from "express";
import UserController from "./user.controller.js";
import { upload } from "../../middleware/fileupload.middleware.js";
import { signUpFormValidate } from "../../middleware/expressValidator.js";
import jwtAuth from "../../middleware/jwt.middleware.js";

// Create an instance of the UserController
const userController = new UserController();

// Create an instance of the Express Router
const userRouter = express.Router();

// Route for user sign-up
userRouter.post('/sign-up', upload.single('profileImage'), signUpFormValidate, userController.signUp);

// Route for user sign-in
userRouter.post('/sign-in', userController.signIn);

// Route for resetting user details
userRouter.put('/reset-details', jwtAuth, upload.single('profileImage'), userController.resetDetails);

// Route for deleting user account
userRouter.delete('/delete-account', jwtAuth, userController.deleteAccount);

// Route for following a user
userRouter.post('/follow-user/:id', jwtAuth, userController.followUser);

// Route for unfollowing a user
userRouter.post('/unfollow-user/:id', jwtAuth, userController.unfollowUser);

// Route for getting user followers
userRouter.get('/get-followers', jwtAuth, userController.getFollowers);

// Route for getting users that the user is following
userRouter.get('/get-following', jwtAuth, userController.getFollowing);

// Export the userRouter
export default userRouter;