import Invoice from '../models/Invoice.js';
import LaborLog from '../models/LaborLog.js';

import { generateInvoicePDF } from '../utils/pdfGenerator.js';

// @desc    Create a new invoice
// @route   POST /api/invoices
export const createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, laborLogIds, billingPeriodStart, billingPeriodEnd } = req.body;

    // Fetch the selected labor logs to ensure they exist and belong to this tenant
    const laborLogs = await LaborLog.find({
      _id: { $in: laborLogIds },
      tenantId: req.user.tenantId,
      status: 'Pending'
    });

    if (!laborLogs || laborLogs.length === 0) {
      return res.status(400).json({ message: 'No valid pending labor logs found' });
    }

    // Calculate the total amount from the selected logs
    const totalAmount = laborLogs.reduce((sum, log) => sum + log.totalWages, 0);

    // Create the invoice
    const invoice = await Invoice.create({
      tenantId: req.user.tenantId,
      invoiceNumber,
      generatedBy: req.user._id,
      laborLogsIncluded: laborLogIds,
      totalAmount,
      billingPeriodStart,
      billingPeriodEnd,
      status: 'Issued'
    });

    // Update the status of the billed labor logs so they aren't billed again
    await LaborLog.updateMany(
      { _id: { $in: laborLogIds } },
      { $set: { status: 'Billed' } }
    );

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating invoice', error: error.message });
  }
};

// @desc    Get all invoices for the logged-in business
// @route   GET /api/invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ tenantId: req.user.tenantId })
                                  .populate('generatedBy', 'fullName email')
                                  .populate('laborLogsIncluded');

    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching invoices', error: error.message });
  }
};

export const downloadInvoicePdf = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId
    }).populate('laborLogsIncluded');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Set headers so the browser knows it's downloading a PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);

    // Generate and send the PDF
    generateInvoicePDF(invoice, res);

  } catch (error) {
    res.status(500).json({ message: 'Server error generating PDF', error: error.message });
  }
};