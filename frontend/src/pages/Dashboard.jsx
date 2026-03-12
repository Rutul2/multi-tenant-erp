import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../utils/api";

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingWages: 0,
    totalLogs: 0,
    totalInvoices: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch both labor and invoices concurrently
        const [laborRes, invoiceRes] = await Promise.all([
          api.get("/labor"),
          api.get("/invoices"),
        ]);

        const laborLogs = laborRes.data;
        const invoices = invoiceRes.data;

        // Calculate pending wages from logs that haven't been billed yet
        const pendingWages = laborLogs
          .filter((log) => log.status === "Pending")
          .reduce((sum, log) => sum + log.totalWages, 0);

        // Calculate total billed revenue from invoices
        const totalRevenue = invoices.reduce(
          (sum, inv) => sum + inv.totalAmount,
          0,
        );

        setStats({
          totalRevenue,
          pendingWages,
          totalLogs: laborLogs.length,
          totalInvoices: invoices.length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="text-gray-600">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Business Overview</h2>
        <p className="text-gray-600">
          Here is what is happening in your business today.
        </p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue Card (Visible to Admins/Managers) */}
        {["Admin", "Manager"].includes(userInfo?.role) && (
          <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">
              Total Billed Revenue
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              ${stats.totalRevenue.toFixed(2)}
            </p>
          </div>
        )}

        {/* Pending Wages Card */}
        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">
            Pending Unbilled Wages
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ${stats.pendingWages.toFixed(2)}
          </p>
        </div>

        {/* Total Labor Logs Card */}
        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">
            Total Labor Entries
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats.totalLogs}
          </p>
        </div>

        {/* Total Invoices Card (Visible to Admins/Managers) */}
        {["Admin", "Manager"].includes(userInfo?.role) && (
          <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">
              Invoices Generated
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.totalInvoices}
            </p>
          </div>
        )}
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Quick Actions</h3>
        <div className="mt-4 flex gap-4">
          <a
            href="/dashboard/labor"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Add New Labor Log
          </a>
          {["Admin", "Manager"].includes(userInfo?.role) && (
            <a
              href="/dashboard/invoices"
              className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            >
              Generate Invoice
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
