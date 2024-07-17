import { NextFunction, Request, Response } from "express";
import { ThrowIncompleteError, ThrowServerError } from "../libs/ResponseErrors";
import UserProps from "../props/UserProps";

/**
 * Middleware function to validate user data.
 * Checks if all required fields are present and if role is either 'editor' or 'admin'.
 * If validation fails, it throws an Incomplete Data error.
 * @param req Request object from Express containing user data in body.
 * @param res Response object from Express.
 * @param next Next function to pass control to the next middleware.
 * @returns Calls the next function if data is valid, otherwise throws a Server Error.
 */

const validateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Destructuring the data object
    const data: UserProps = req.body;
    const { name, username, password, role } = data;

    // Checking if all required fields are provided
    if (
      !name ||
      !username ||
      !password ||
      !role ||
      (role !== "editor" && role !== "admin")
    ) {
      return ThrowIncompleteError(res); // Returning error if any field is missing or role is invalid
    }

    req.body.newUser = data;

    // Moving to the next middleware or controller
    next();
  } catch (error) {
    console.error(error);
    ThrowServerError(res);
  }
};

export default validateUserData;
