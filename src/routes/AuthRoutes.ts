import express from "express";
import adminAuthorised from "../middlewares/AdminAuthorised";
import * as authControllers from "../controllers/AuthControllers";
import authorised from "../middlewares/Authorised";
import validateUserData from "../middlewares/ValidateUserData";

const router = express.Router();

// Route to register a new user
// This route is protected by the adminAuthorised middleware, meaning only admins can access it
// This route also uses validateUserData to make sure all required fields are provided
// /api/v1/auth/registerUser
router.post(
  "/registerUser",
  adminAuthorised,
  validateUserData,
  authControllers.registerUser
);

// Route to log in a user
// This route is accessible to all users
// /api/v1/auth/login
router.post("/login", authControllers.logIn);

// Route to change the password
// This route is protected by the authorised middleware, meaning only authenticated users can access it
// /api/v1/auth/changePassword
router.put("/changePassword", authorised, authControllers.changePassword);

export default router;
