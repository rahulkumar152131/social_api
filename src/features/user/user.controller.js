// Import necessary modules
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

import UserModel from "./user.model.js";
import UserRepository from "./user.repository.js";

export default class UserController {
    constructor() {
        this.userRepository = new UserRepository();
    }

    // Controller for handling user sign up requests
    signUp = async (req, res, next) => {
        try {
            const { name, email, password, bio } = req.body;

            // Hash the user's password
            const hashPassword = await bcrypt.hash(password, 12);

            // Create a new user model instance
            const newUser = new UserModel(name, email, hashPassword, bio, req.file.path);

            // Sign up the new user using the repository
            const response = await this.userRepository.signUp(newUser);

            // Send the response
            return res.status(201).send(response);
        } catch (error) {
            // Pass any error to the error handler
            next(error);
        }
    }

    // Controller for handling user sign in requests
    signIn = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await this.userRepository.findByEmail(email);

            // Check if the user exists
            if (!user) {
                return res.status(400).send({ success: false, msg: 'Incorrect Credentials' });
            } else {
                // Compare password to hashed password
                const result = await bcrypt.compare(password, user.password);

                // If the password is correct, create a token
                if (result) {
                    const token = jwt.sign(
                        { userID: user._id, email: user.email, userName: user.userName },
                        process.env.JWT_SECRET,
                        { expiresIn: '30d' });

                    const loginUser = {
                        userID: user.userId,
                        userName: user.userName,
                        email: user.email,
                        profileImage: user.profileImage,
                        type: user.type
                    }

                    // Send success response with token and user information
                    res.status(200).json({ success: true, msg: 'Login Successful', token, user: loginUser });
                } else {
                    // Send failure response for incorrect credentials
                    return res.status(400).send({ success: false, msg: 'Incorrect Credentials' });
                }
            }
        } catch (err) {
            // Pass any error to the error handler
            next(err);
        }
    }

    // Controller for handling user details reset requests
    resetDetails = async (req, res, next) => {
        try {
            const { name, email, password, bio } = req.body;

            // Hash the new password
            const hashPassword = await bcrypt.hash(password, 12);

            // Create a new user model instance with updated details
            const updatedDetails = new UserModel(name, email, hashPassword, bio, req.file.path);

            // Reset user details using the repository
            const response = await this.userRepository.resetDetails(req.email, updatedDetails);

            // Send the response
            if (response.success) {
                return res.status(201).send(response);
            } else {
                return res.status(404).send(response);
            }
        } catch (err) {
            // Pass any error to the error handler
            next(err);
        }
    }

    // Controller for handling user account deletion requests
    deleteAccount = async (req, res, next) => {
        try {
            // Delete user account using the repository
            const response = await this.userRepository.deleteAccount(req.email);

            // Send the response
            if (response.success) {
                return res.status(201).send(response);
            } else {
                return res.status(404).send(response);
            }
        } catch (err) {
            // Pass any error to the error handler
            next(err);
        }
    }

    // Controller for handling user follow requests
    followUser = async (req, res, next) => {
        try {
            const userID = req.userID;

            // Check if the user is trying to follow themselves
            if (userID === req.params.id) {
                return res.status(201).send({ success: false, msg: "you can't follow yourself" });
            }

            // Follow the user using the repository
            const response = await this.userRepository.followUser(userID, req.params.id);

            // Send the response
            if (response.success) {
                return res.status(201).send(response);
            } else {
                return res.status(404).send(response);
            }
        } catch (err) {
            // Pass any error to the error handler
            next(err);
        }
    }

    // Controller for handling user unfollow requests
    unfollowUser = async (req, res, next) => {
        try {
            const userID = req.userID;

            // Check if the user is trying to unfollow themselves
            if (userID === req.params.id) {
                return res.status(201).send({ success: false, msg: "you can't unfollow yourself" });
            }

            // Unfollow the user using the repository
            const response = await this.userRepository.unfollowUser(userID, req.params.id);

            // Send the response
            if (response.success) {
                return res.status(201).send(response);
            } else {
                return res.status(404).send(response);
            }
        } catch (err) {
            // Pass any error to the error handler
            next(err);
        }
    }

    // Controller for handling user followers retrieval requests
    getFollowers = async (req, res, next) => {
        try {
            const userID = req.userID;

            // Get followers using the repository
            const response = await this.userRepository.getFollowers(userID);

            // Send the response
            if (response.success) {
                return res.status(201).send(response);
            } else {
                return res.status(404).send(response);
            }
        } catch (err) {
            // Pass any error to the error handler
            next(err);
        }
    }

    // Controller for handling user following retrieval requests
    getFollowing = async (req, res, next) => {
        try {
            const userID = req.userID;

            // Get following users using the repository
            const response = await this.userRepository.getFollowing(userID);

            // Send the response
            if (response.success) {
                return res.status(201).send(response);
            } else {
                return res.status(404).send(response);
            }
        } catch (err) {
            // Pass any error to the error handler
            next(err);
        }
    }
}