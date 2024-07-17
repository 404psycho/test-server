import { Response } from "express";

/**
 * Throws a 500 Internal Server Error response.
 * @param res Express Response object.
 * @returns JSON response indicating Internal Server Error.
 */
export const ThrowServerError = (res: Response) => {
  return res.status(500).json({ message: "Internal Server Error" });
};

/**
 * Throws a 400 Bad Request response for incomplete data.
 * @param res Express Response object.
 * @returns JSON response indicating Incomplete data.
 */
export const ThrowIncompleteError = (res: Response) => {
  return res.status(400).json({ message: "Incomplete data" });
};

/**
 * Throws a 400 Bad Request response with a custom error message.
 * @param res Express Response object.
 * @param message Custom error message to include in the response.
 * @returns JSON response with the provided error message.
 */
export const ThrowBadRequest = (res: Response, message: string) => {
  return res.status(400).json({ message });
};

/**
 * Throws a 401 Unauthorized response.
 * @param res Express Response object.
 * @returns JSON response indicating Unauthorized access.
 */
export const ThrowUnAuthorizedError = (res: Response) => {
  return res.status(401).json({ message: "Unauthorized" });
};

/**
 * Throws a 404 Not Found response with a custom error message.
 * @param res Express Response object.
 * @param message Custom error message to include in the response.
 * @returns JSON response with the provided error message.
 */
export const ThrowNotFoundError = (res: Response, message: string) => {
  return res.status(404).json({ message });
};
