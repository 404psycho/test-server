import express from "express";
import * as invoiceControllers from "../controllers/InvoiceController";
import adminAuthorised from "../middlewares/AdminAuthorised";
import authorised from "../middlewares/Authorised";
import validateInvoiceData from "../middlewares/ValidateInvoiceData";

const router = express.Router();

// Route to get the current invoice number
// This route is protected by the authorised middleware, meaning only authenticated users can access it
// /api/v1/invoices/getInvoiceNumber
router.get(
  "/getInvoiceNumber",
  authorised,
  invoiceControllers.getInvoiceNumber
);

// Route to get a specific invoice by its invoice number
// This route is protected by the authorised middleware, meaning only authenticated users can access it
// /api/v1/invoices/getInvoice/{invoiceNumber}
router.get(
  "/getInvoice/:invoiceNumber",
  authorised,
  invoiceControllers.getInvoice
);

// Route to get invoices by a specific variant
// This route is protected by the authorised middleware, meaning only authenticated users can access it
// /api/v1/invoices/getInvoices/{variant} i.e. variant = draft || saved
router.get(
  "/getInvoices/:variant",
  authorised,
  invoiceControllers.getInvoicesByVariant
);

// Route to save a new invoice
// This route is protected by the authorised middleware, meaning only authenticated users can access it
// This route also uses validateInvoiceData middleware to make sure all required fields are provided
// /api/v1/invoices/saveInvoice
router.post(
  "/saveInvoice",
  authorised,
  validateInvoiceData,
  invoiceControllers.saveInvoice
);

// Route to update an existing invoice
// This route is protected by the authorised middleware, meaning only authenticated users can access it
// This route also uses validateInvoiceData middleware to make sure all required fields are provided
// /api/v1/invoices/updateInvoice
router.post(
  "/updateInvoice",
  authorised,
  validateInvoiceData,
  invoiceControllers.updateInvoice
);

// Route to delete a specific invoice by its invoice number
// This route is protected by the adminAuthorised middleware, meaning only admins can access it
// /api/v1/invoices/deleteInvoice/{invoiceNumber}
router.delete(
  "/deleteInvoice/:invoiceNumber",
  adminAuthorised,
  invoiceControllers.deleteInvoice
);

export default router;
