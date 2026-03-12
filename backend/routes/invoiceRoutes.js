import express from 'express';
// Update the import to include downloadInvoicePdf
import { createInvoice, getInvoices, downloadInvoicePdf } from '../controllers/invoiceController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('Admin', 'Manager'), createInvoice);
router.get('/', protect, getInvoices);

// Add the new PDF download route
router.get('/:id/pdf', protect, authorizeRoles('Admin', 'Manager'), downloadInvoicePdf);

export default router;