import PDFDocument from 'pdfkit';

export const generateInvoicePDF = (invoice, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // Pipe the PDF directly to the Express response
  doc.pipe(res);

  // Header
  doc.fontSize(20).text(`Invoice: ${invoice.invoiceNumber}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
  doc.text(`Billing Period: ${new Date(invoice.billingPeriodStart).toLocaleDateString()} - ${new Date(invoice.billingPeriodEnd).toLocaleDateString()}`);
  doc.moveDown();

  // Table Header
  doc.fontSize(14).text('Included Labor Logs', { underline: true });
  doc.moveDown(0.5);

  // Table Content
  invoice.laborLogsIncluded.forEach((log, index) => {
    doc.fontSize(12).text(
      `${index + 1}. ${log.jobType} | Qty: ${log.quantityCompleted} | Rate: $${log.ratePerUnit} | Total: $${log.totalWages}`
    );
  });

  doc.moveDown();
  doc.fontSize(16).text(`Total Amount Due: $${invoice.totalAmount}`, { align: 'right' });

  // Finalize the PDF file
  doc.end();
};