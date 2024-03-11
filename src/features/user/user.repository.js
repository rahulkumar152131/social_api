// Import necessary modules

import { ApplicationError } from "../../error-handler/applicationError.js";
import userModel from './user.schema.js';
import { ObjectId } from "mongodb";

export default class UserRepository {
    // Method for handling user sign up
    async signUp(user) {
        try {
            const alreadyRegisteredEmail = await userModel.findOne({ email: user.email });
            // console.log(alreadyRegisteredEmail);
            if (alreadyRegisteredEmail) {
                return { success: false, msg: 'Email is already Registered' };
            }
            const newUser = new userModel(user);
            await newUser.save();

            // Omit the password from the response
            const { password, ...userWithoutPassword } = newUser.toObject();

            return { success: true, msg: "Registration Successful", res: userWithoutPassword };
        } catch (err) {
            // Handle database errors
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    // Method for finding a user by email
    async findByEmail(email) {
        try {
            const user = await userModel.findOne({ email: email }).select('+password').select('+email').lean();
            return user;
        } catch (err) {
            // Handle database errors
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    // Method for updating user details
    async resetDetails(userID, updatedDetails) {
        try {
            const alreadyRegisteredEmail = await userModel.findOne({ email: updatedDetails.email });
            if (alreadyRegisteredEmail) {
                return { success: false, msg: 'Email is already Registered' };
            }
            console.log(updatedDetails);
            const user = await userModel.findByIdAndUpdate(userID, updatedDetails, { new: true, select: { password: 0 } });
            console.log(user);
            // Check if the user exists
            if (!user) {
                return { success: false, msg: 'User not found' };
            } else {
                return { success: true, msg: 'User updating details successful', res: user };
            }
        } catch (err) {
            // Handle database errors
            console.log(err);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    // Method for deleting a user account
    async deleteAccount(email, updatedDetails) {
        try {
            const user = await userModel.findOneAndDelete({ email: email });

            // Check if the user exists
            if (!user) {
                return { success: false, msg: 'User not found' };
            } else {
                return { success: true, msg: 'User deleting successful', res: user };
            }
        } catch (err) {
            // Handle database errors
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    // Method for handling user follow requests
    async followUser(userID, targetUserId) {
        try {
            const user = await userModel.findById(userID);
            const userToBeFollow = await userModel.findById(targetUserId);

            // Check if users exist
            if (!user || !userToBeFollow) {
                return { success: false, msg: 'User not found' };
            }

            // Check if already following
            if (user.following.includes(targetUserId)) {
                return { success: false, msg: 'Already following' };
            } else {

                // Update the following and followers lists
                await userModel.findOneAndUpdate(
                    { _id: new ObjectId(userID) },
                    { $push: { following: new ObjectId(targetUserId) } }
                );

                await userModel.findOneAndUpdate(
                    { _id: new ObjectId(targetUserId) },
                    { $push: { followers: new ObjectId(userID) } }
                );

                return { success: true, msg: 'User following successful' };
            }

        } catch (err) {
            // Handle database errors
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    // Method for handling user unfollow requests
    async unfollowUser(userID, userToBeFollowId) {
        try {
            const user = await userModel.findById(userID);
            const userToBeFollow = await userModel.findById(userToBeFollowId);

            // Check if users exist
            if (!user || !userToBeFollow) {
                return { success: false, msg: 'User not found' };
            }

            // Check if not already following
            if (!user.following.includes(userToBeFollowId)) {
                return { success: false, msg: 'You are not following' };
            } else {
                // Update the following and followers lists
                await userModel.findOneAndUpdate(
                    { _id: new ObjectId(userID) },
                    { $pull: { following: new ObjectId(userToBeFollowId) } }
                );

                await userModel.findOneAndUpdate(
                    { _id: new ObjectId(userToBeFollowId) },
                    { $pull: { followers: new ObjectId(userID) } }
                );

                return { success: true, msg: 'User unfollowing successful' };
            }

        } catch (err) {
            // Handle database errors
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    // Method for retrieving user followers
    async getFollowers(userID) {
        try {
            const user = await userModel.findById(userID)
                .populate({
                    path: 'followers',
                    model: 'users'
                })

            // Check if the user exists
            console.log(user);
            if (!user) {
                return { success: false, msg: 'User not found' };
            } else {
                return { success: true, msg: 'Getting followers successful', res: user.followers };
            }
        } catch (err) {
            // Handle database errors
            console.log(err);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }

    // Method for retrieving users that the user is following
    async getFollowing(userID) {
        try {
            const user = await userModel.findById(userID)
                .populate({
                    path: 'following',
                    model: 'users'
                })

            // Check if the user exists
            if (!user) {
                return { success: false, msg: 'User not found' };
            } else {
                return { success: true, msg: 'Getting following successful', res: user.following };
            }
        } catch (err) {
            // Handle database errors
            throw new ApplicationError('Something went wrong with the database', 500);
        }
    }
}