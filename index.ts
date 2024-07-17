import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import env from "dotenv";
import express, { Request, Response } from "express";
import { createServer } from "http";
import connectToMongo from "./connectToMongo";
import authRoutes from "./routes/AuthRoutes";
import userRoutes from "./routes/UserRoutes";
import invoiceRoutes from "./routes/InvoiceRoutes";

// Loading environment variables from .env file
env.config();

const app = express(); // Creating an Express application
const server = createServer(app); // Creating an HTTP server using the Express app

// Middleware to enable Cross-Origin Resource Sharing with credentials support
app.use(
  cors({
    credentials: true,
  })
);

app.use(compression()); // Middleware to compress response bodies
app.use(cookieParser()); // Middleware to parse cookies attached to client requests
app.use(bodyParser.json()); // Middleware to parse JSON bodies from client requests

// Connecting to MongoDB database
connectToMongo();

// Setting up routes for authentication, user, and invoice management
app.use("/api/v1/auth", authRoutes); // Routes for authentication
app.use("/api/v1/users", userRoutes); // Routes for user management
app.use("/api/v1/invoices", invoiceRoutes); // Routes for invoice management

// Default route to indicate server is running
app.use("/api/v1/", (req: Request, res: Response) =>
  res.send("Server running")
);

// Starting the server and listening on port 8080
server.listen(8080, () => {
  console.log("Server running");
});

export default app;
