import { Request, Response } from "express";
import { ThrowBadRequest, ThrowServerError } from "../libs/ResponseErrors";
import Invoice from "../models/InvoiceModel";
import InvoiceNumber from "../models/InvoiceNumberModel";

type variantProps = "saved" | "drafts";

/**
 * Controller to get the latest invoice number.
 * @param req Request object from Express.
 * @param res Response object from Express.
 * @returns A JSON response with the latest invoice number.
 */
export const getInvoiceNumber = async (req: Request, res: Response) => {
  try {
    // Getting latest invoice number
    const latestInvoiceNumber = await InvoiceNumber.findOne();

    // Adding 1 to latest invoice number
    latestInvoiceNumber.number += 1;

    // Response
    return res.status(200).json(latestInvoiceNumber);
  } catch (error) {
    console.error(error);
    ThrowServerError(res);
  }
};

/**
 * Controller to get invoices by variant (saved or drafts).
 * @param req Request object from Express containing the variant in params.
 * @param res Response object from Express.
 * @returns A JSON response with invoices filtered by variant.
 */
export const getInvoicesByVariant = async (req: Request, res: Response) => {
  try {
    const variant = req.params.variant as variantProps;

    // Validating variant
    if (variant !== "drafts" && variant !== "saved") {
      return ThrowBadRequest(res, "Invalid request");
    }

    // Finding all invoices based on variant (drafts or saved)
    const invoices = await Invoice.find({
      isDraft: variant === "drafts",
    }).sort({ invoiceNumber: -1 });

    // Response
    return res.status(200).json({ invoices });
  } catch (error) {
    console.error(error);
    ThrowServerError(res);
  }
};

/**
 * Controller to get an invoice by invoice number.
 * @param req Request object from Express containing the invoice number in params.
 * @param res Response object from Express.
 * @returns A JSON response with the found invoice.
 */
export const getInvoice = async (req: Request, res: Response) => {
  try {
    // Destruturing
    const { invoiceNumber } = req.params;

    // Parsing invoiceNumber
    const parsedNumber = Number.parseInt(invoiceNumber);
    if (isNaN(parsedNumber)) {
      return ThrowBadRequest(res, "Invalid invoice number");
    }

    // Finding invoice
    const invoice = await Invoice.findOne({
      invoiceNumber: parsedNumber,
    });

    return res.status(200).json({ invoice });
  } catch (error) {
    console.error(error);
    ThrowServerError(res);
  }
};

/**
 * Controller to save a new invoice.
 * @param req Request object from Express containing invoice data in body and user data.
 * @param res Response object from Express.
 * @returns A JSON response indicating success or failure of invoice creation.
 */
export const saveInvoice = async (req: Request, res: Response) => {
  try {
    // Destructuring
    const { invoice, user } = req.body;

    // Getting latest invoice number
    const latestInvoiceNumber = await InvoiceNumber.findOne();

    // Saving new invoice
    const newInvoice = await Invoice.create({
      ...invoice,
      invoiceNumber: latestInvoiceNumber.number + 1,
      createdBy: user.name,
    });

    // Updating latest invoice number
    await InvoiceNumber.findByIdAndUpdate(latestInvoiceNumber._id, {
      number: latestInvoiceNumber.number + 1,
    });

    // Response
    return res.status(200).json({
      message: "Invoice saved",
      invoiceNumber: newInvoice.invoiceNumber,
    });
  } catch (error) {
    console.error(error);
    ThrowServerError(res);
  }
};

/**
 * Controller to delete an invoice by invoice number.
 * @param req Request object from Express containing the invoice number in params.
 * @param res Response object from Express.
 * @returns A JSON response indicating success or failure of invoice deletion.
 */
export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    // Destructuring
    const { invoiceNumber } = req.params;

    // Parsing invoiceNumber
    const parsedNumber = Number.parseInt(invoiceNumber);
    if (isNaN(parsedNumber)) {
      return ThrowBadRequest(res, "Invalid invoice number");
    }

    // Deleting invoice
    const deletedInvoice = await Invoice.deleteOne({
      invoiceNumber: parsedNumber,
    });

    // If invoice is not deleted
    if (!deletedInvoice) {
      return ThrowServerError(res);
    }

    // Response
    return res.status(200).json({ message: "Invoice deleted" });
  } catch (error) {
    console.error(error);
    ThrowServerError(res);
  }
};

/**
 * Controller to update an invoice.
 * @param req Request object from Express containing updated invoice data in body.
 * @param res Response object from Express.
 * @returns A JSON response indicating success or failure of invoice update.
 */
export const updateInvoice = async (req: Request, res: Response) => {
  try {
    // Destructuring
    const { invoice } = req.body;

    // Updating invoice by invoiceNumber
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { invoiceNumber: invoice.invoiceNumber },
      { ...invoice },
      { new: true }
    );

    // If invoice is not updated
    if (!updatedInvoice) {
      return ThrowServerError(res);
    }
    // Response
    return res.status(200).json({ message: "Invoice updated" });
  } catch (error) {
    console.error(error);
    ThrowServerError(res);
  }
};
