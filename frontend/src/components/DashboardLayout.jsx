import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

const DashboardLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-800">
          ERP System
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Dashboard Home
          </Link>
          <Link
            to="/dashboard/labor"
            className="block px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Labor Logs
          </Link>
          {["Admin", "Manager"].includes(userInfo?.role) && (
            <Link
              to="/dashboard/invoices"
              className="block px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Invoices
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="mb-2 text-sm text-gray-400">
            Logged in as: <br />
            <span className="text-white font-semibold">
              {userInfo?.fullName}
            </span>
            <br />
            <span className="text-xs text-gray-500">{userInfo?.role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 mt-2 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Welcome, {userInfo?.fullName}
          </h1>
        </header>
        <div className="p-6">
          {/* Outlet renders the specific nested route component here */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
