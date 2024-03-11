// Import necessary modules
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

import UserModel from "./user.model.js";
import UserRepository from "./user.repository.js";
import { check, validationResult } from "express-validator";

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
            if (response.success) {
                return res.status(201).send(response);
            } else {
                return res.status(400).send(response);
            }
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
            const updatedDetails = {};
            const validationResults = [];

            // Validate and update bio
            if (bio) {
                validationResults.push(
                    check('bio')
                        .notEmpty()
                        .withMessage('Bio should not be empty')
                );
                updatedDetails.bio = bio;
            }

            // Validate and update name
            if (name) {
                validationResults.push(
                    check('name')
                        .isLength({ min: 5, max: 25 })
                        .withMessage('Name must be between 5 to 25 characters')
                        .custom((value) => {
                            return !/\d/.test(value) && !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value);
                        })
                        .withMessage("Name doesn't contain Special Character and digit")
                );
                updatedDetails.userName = name;
            }

            // Validate and update email
            if (email) {
                validationResults.push(
                    check('email')
                        .isEmail().withMessage('Enter a valid email')
                );
                updatedDetails.email = email;
            }

            // Validate and update password
            if (password) {
                validationResults.push(
                    check('password')
                        .isLength({ min: 8, max: 24 }).withMessage('Password must be between 8 and 24 characters')
                        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
                        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
                        .matches(/\d/).withMessage('Password must contain at least one digit')
                        .matches(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/).withMessage('Password must contain at least one special character')
                );
                const hashPassword = await bcrypt.hash(password, 12);
                updatedDetails.password = hashPassword;
            }

            // Validate and update profileImage
            if (req.file) {
                validationResults.push(
                    check("profileImage")
                        .custom((value) => {
                            if (req.file.mimetype === "image/gif" || req.file.mimetype === "image/jpg" || req.file.mimetype === "image/png" || req.file.mimetype === "image/jpeg") {
                                return true;
                            } else {
                                return false;
                            }
                        }).withMessage("Please upload an image gif, Jpg, Jpeg, Png")
                );
                updatedDetails.profileImage = req.file.path;
            }

            // Run validation for each field
            for (const validation of validationResults) {
                await validation.run(req);
            }

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, msg: 'Validation failed', errors: errors.array() });
            }

            // Reset user details using the repository
            const response = await this.userRepository.resetDetails(req.userID, updatedDetails);

            // Send the response
            if (response.success) {
                return res.status(200).send(response);
            } else {
                return res.status(404).send(response);
            }
        } catch (err) {
            // Pass any error to the error handler
            console.log(err);
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
                return res.status(200).send(response);
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
                return res.status(200).send(response);
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
                return res.status(400).send({ success: false, msg: "you can't unfollow yourself" });
            }

            // Unfollow the user using the repository
            const response = await this.userRepository.unfollowUser(userID, req.params.id);

            // Send the response
            if (response.success) {
                return res.status(200).send(response);
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
                return res.status(200).send(response);
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
                return res.status(200).send(response);
            } else {
                return res.status(404).send(response);
            }
        } catch (err) {
            // Pass any error to the error handler
            next(err);
        }
    }
}