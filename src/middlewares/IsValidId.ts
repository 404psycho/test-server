/**
 * Middleware function to validate if the provided id parameter is a valid MongoDB ObjectId.
 * If the id length is not 24 characters, it throws a Bad Request error.
 * @param req Request object from Express containing parameters.
 * @param res Response object from Express.
 * @param next Next function to pass control to the next middleware.
 * @returns Calls the next function if id is valid, otherwise throws a Bad Request or Server Error.
 */
import { NextFunction, Request, Response } from "express";
import { ThrowBadRequest, ThrowServerError } from "../libs/ResponseErrors";

const isValidId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Checking if provided id is valid
    if (id.length !== 24) {
      return ThrowBadRequest(res, "Invalid Id");
    }

    // Moving to the next middleware or controller
    next();
  } catch (error) {
    console.error(error);
    ThrowServerError(res);
  }
};

export default isValidId;
