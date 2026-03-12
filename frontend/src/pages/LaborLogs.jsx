import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../utils/api";

const LaborLogs = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [logs, setLogs] = useState([]);
  const [jobType, setJobType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Fetch logs when the component loads
  const fetchLogs = async () => {
    try {
      const response = await api.get("/labor");
      setLogs(response.data);
    } catch (err) {
      setFetchError("Failed to load labor logs");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Handle submitting a new labor entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/labor", {
        workerId: userInfo._id, // Assign the logged-in user as the worker
        jobType,
        quantityCompleted: Number(quantity),
        ratePerUnit: Number(rate),
      });

      // Reset form
      setJobType("");
      setQuantity("");
      setRate("");

      // Refresh the table
      fetchLogs();
    } catch (err) {
      alert("Failed to add labor log");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Labor Management</h2>

      {/* Add New Labor Log Form */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-700">
          Log Daily Work
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 items-end"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Job Type (e.g., Stitching)
            </label>
            <input
              type="text"
              required
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              required
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Rate per Unit ($)
            </label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? "Saving..." : "Add Log"}
          </button>
        </form>
      </div>

      {/* Labor Logs Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        {fetchError ? (
          <div className="p-4 text-red-600">{fetchError}</div>
        ) : (
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase">
                  Worker
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase">
                  Job Type
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase">
                  Qty & Rate
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase">
                  Total Wages
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {log.workerId?.fullName || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {log.jobType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {log.quantityCompleted} @ ${log.ratePerUnit}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${log.totalWages.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        log.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : log.status === "Billed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No labor logs found. Start adding some above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LaborLogs;
