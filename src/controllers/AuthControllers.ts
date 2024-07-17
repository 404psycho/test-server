import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { signJwtAccessToken } from "../libs/Jwt";
import {
  ThrowBadRequest,
  ThrowIncompleteError,
  ThrowNotFoundError,
  ThrowServerError,
} from "../libs/ResponseErrors";
import User from "../models/UserModel";
import UserProps from "../props/UserProps";

/**
 * Controller to register a new user.
 * @param req Request object from Express containing new user data in body.
 * @param res Response object from Express.
 * @returns A JSON response indicating success or failure of user registration.
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    // Getting new user's data from request
    const data = req.body.newUser as UserProps;
    const { password, username } = data;

    // Checking if a user already exists with the provided username
    const userExists = await User.findOne({
      username: username.toLowerCase(),
    });

    if (userExists) {
      return ThrowBadRequest(res, "User already exists with this username");
    }

    // Hashing the password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    // Updating the password in the data object
    data.password = hash;
    data.username = username.toLowerCase();

    // Creating a new user with the hashed password
    const newUser = await User.create({
      ...data,
    });

    if (!newUser) return ThrowServerError(res);

    return res.status(201).json({ message: "User has been added" });
  } catch (error) {
    console.error(error);
    ThrowServerError(res);
  }
};

/**
 * Controller to log in a user.
 * @param req Request object from Express containing username and password in body.
 * @param res Response object from Express.
 * @returns A JSON response with user details and access token upon successful login.
 */
export const logIn = async (req: Request, res: Response) => {
  try {
    // Destructuring
    const { username, password } = req.body;

    // Validating data
    if (!username || !password) return ThrowIncompleteError(res);

    // Finding user
    const user = await User.findOne({
      username,
    });
    if (!user) return ThrowNotFoundError(res, "Invalid Credentials");

    // Checking password
    const isCorrectPassword = bcrypt.compareSync(password, user.password);
    if (!isCorrectPassword) {
      return ThrowBadRequest(res, "Invalid credentials");
    }

    // Signing accessToken
    const accessToken = await signJwtAccessToken({
      userId: user.id,
    });

    // Returning response with user details and access token
    return res.status(200).json({
      user: {
        accessToken,
        _id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    ThrowServerError(res);
  }
};

/**
 * Controller to change a user's password.
 * @param req Request object from Express containing old and new password in body, and user details.
 * @param res Response object from Express.
 * @returns A JSON response indicating success or failure of password change.
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    // Destructuring data from req body
    const { oldPassword, newPassword, user } = req.body;

    // Validating data
    if (!oldPassword || !newPassword) {
      return ThrowIncompleteError(res);
    }

    // Comparing password
    const isPasswordCorrect = bcrypt.compareSync(oldPassword, user.password);

    // If password does not match
    if (!isPasswordCorrect) {
      return ThrowBadRequest(res, "Wrong old password");
    }

    // Hashing the new password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

    // Updating new password in the database
    const updatedPassword = await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    if (!updatedPassword) return ThrowServerError(res);

    // Returning success message
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    ThrowServerError(res);
  }
};
