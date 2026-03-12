import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  generatedBy: { // The Admin or Manager who created the bill
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  laborLogsIncluded: [{ // References the specific labor entries being billed
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LaborLog'
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  billingPeriodStart: {
    type: Date,
    required: true
  },
  billingPeriodEnd: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Issued', 'Paid'],
    default: 'Issued'
  }
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;