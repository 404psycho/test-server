import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../libs/Jwt";
import {
  ThrowServerError,
  ThrowUnAuthorizedError,
} from "../libs/ResponseErrors";
import User from "../models/UserModel";

/**
 * Middleware to authorize admin access based on JWT access token.
 * @param req Express Request object.
 * @param res Express Response object.
 * @param next Express NextFunction to call the next middleware.
 * @returns Calls next() if authorized, otherwise sends a 401 Unauthorized response.
 */
const adminAuthorised = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.headers["accesstoken"] as string;

    // If no accessToken is found
    if (!accessToken) return ThrowUnAuthorizedError(res);

    // Verifying the JWT access token
    const user = await verifyJwt(accessToken);

    // If access token is not verified or user ID is missing
    if (!user || !user.userId) {
      return ThrowUnAuthorizedError(res);
    }

    // Finding user details by user ID from the token
    const userDetails = await User.findById(user.userId);

    // If no user found or user is not an admin
    if (!userDetails || userDetails.role !== "admin") {
      return ThrowUnAuthorizedError(res);
    }

    // Attaching user details to the request body for further use
    req.body.user = userDetails;

    // Moving to the next middleware or controller
    next();
  } catch (error) {
    console.error(error);
    ThrowServerError(res);
  }
};

export default adminAuthorised;
