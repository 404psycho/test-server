import { Schema, model, models } from "mongoose";

const invoiceNumberSchema = new Schema(
  {
    number: {
      type: Number,
    },
  },
  { timestamps: true }
);

const InvoiceNumber =
  models.InvoiceNumber || model("InvoiceNumber", invoiceNumberSchema);

export default InvoiceNumber;
