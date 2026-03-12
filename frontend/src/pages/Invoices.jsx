import { useState, useEffect } from "react";
import api from "../utils/api";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [pendingLogs, setPendingLogs] = useState([]);

  // Form State
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedLogs, setSelectedLogs] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch all invoices
      const invRes = await api.get("/invoices");
      setInvoices(invRes.data);

      // Fetch labor logs and filter only 'Pending' ones to show in the form
      const laborRes = await api.get("/labor");
      const unbilled = laborRes.data.filter((log) => log.status === "Pending");
      setPendingLogs(unbilled);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckboxChange = (logId) => {
    setSelectedLogs((prev) =>
      prev.includes(logId)
        ? prev.filter((id) => id !== logId)
        : [...prev, logId],
    );
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (selectedLogs.length === 0)
      return alert("Please select at least one labor log.");

    setIsLoading(true);
    try {
      await api.post("/invoices", {
        invoiceNumber,
        billingPeriodStart: startDate,
        billingPeriodEnd: endDate,
        laborLogIds: selectedLogs,
      });

      // Reset form and refresh data
      setInvoiceNumber("");
      setStartDate("");
      setEndDate("");
      setSelectedLogs([]);
      fetchData();
    } catch (err) {
      alert("Failed to create invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async (invoiceId, invNum) => {
    try {
      // responseType: 'blob' is required to handle binary file data in Axios
      const response = await api.get(`/invoices/${invoiceId}/pdf`, {
        responseType: "blob",
      });

      // Create a URL for the downloaded file and trigger the browser to save it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${invNum}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download PDF");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Invoice Management</h2>

      {/* Create Invoice Form */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-700">
          Generate New Invoice
        </h3>
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Invoice Number
              </label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-blue-500"
                placeholder="INV-001"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Pending Labor Logs to Bill
            </label>
            <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
              {pendingLogs.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No pending labor logs available.
                </p>
              ) : (
                pendingLogs.map((log) => (
                  <div key={log._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={log._id}
                      checked={selectedLogs.includes(log._id)}
                      onChange={() => handleCheckboxChange(log._id)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label
                      htmlFor={log._id}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {new Date(log.date).toLocaleDateString()} - {log.jobType}{" "}
                      ({log.quantityCompleted} units) - $
                      {log.totalWages.toFixed(2)}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || pendingLogs.length === 0}
            className="px-6 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? "Generating..." : "Generate Invoice"}
          </button>
        </form>
      </div>

      {/* Invoices List */}
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase">
                Invoice #
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase">
                Generated By
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase">
                Period
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((inv) => (
              <tr key={inv._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {inv.invoiceNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {inv.generatedBy?.fullName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(inv.billingPeriodStart).toLocaleDateString()} -{" "}
                  {new Date(inv.billingPeriodEnd).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                  ${inv.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() =>
                      handleDownloadPDF(inv._id, inv.invoiceNumber)
                    }
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No invoices generated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
