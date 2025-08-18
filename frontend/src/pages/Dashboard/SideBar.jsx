import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FileSearch, Users, UserCog } from "lucide-react";
import logo from "../../images/logo.png";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "User";

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Audit Logs", path: "/logs", icon: <FileSearch size={18} /> },
  ];

  const adminItems = [
    { label: "Manage Admins", path: "/manageAdmins", icon: <UserCog size={18} /> },
    { label: "Manage Employees", path: "/manageEmployees", icon: <Users size={18} /> },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col">
      {/* Header */}
      <div className="flex flex-col items-center py-6 border-b">
        <img src={logo} alt="CEB Logo" className="w-14 h-14 object-contain mb-2" />
        <h1 className="text-base font-semibold text-gray-800 text-center">
          CEB WELFARE <br /> WPS II
        </h1>
        <p className="text-sm text-gray-500 mt-2">Hi {username}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6">
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">Dashboard</h2>
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm ${
                    location.pathname === item.path
                      ? "bg-gray-200 font-medium text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">Admin</h2>
          <ul className="space-y-1">
            {adminItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm ${
                    location.pathname === item.path
                      ? "bg-gray-200 font-medium text-gray-900"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer - Orange Theme */}
      <div className="w-full py-4 bg-orange-600 text-white text-xs text-center">
        © {new Date().getFullYear()} CEB | v1.0
      </div>
    </aside>
  );
};

export default SideBar;
