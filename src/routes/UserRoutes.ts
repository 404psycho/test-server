import express from "express";
import * as userControlles from "../controllers/UserControllers"; 
import adminAuthorised from "../middlewares/AdminAuthorised"; 
import isValidId from "../middlewares/IsValidId"; 

const router = express.Router();

// Route to get all users
// This route is protected by the adminAuthorised middleware, meaning only admins can access it
// /api/v1/users/getUsers
router.get("/getUsers", adminAuthorised, userControlles.getUsers);

// Route to remove a user by their ID
// This route is protected by the adminAuthorised middleware, meaning only admins can access it
// Additionally, it uses the isValidId middleware to check if the provided ID is valid
// /api/v1/users/removeUser/{id}
router.delete(
  "/removeUser/:id",
  adminAuthorised,
  isValidId,
  userControlles.removeUser
);

export default router; 
