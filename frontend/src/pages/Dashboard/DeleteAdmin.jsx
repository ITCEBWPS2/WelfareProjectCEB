import React, { useEffect, useState } from 'react';
import bgImage from '../../images/background.png';
import { useNavigate, Link } from 'react-router-dom';

const ViewAdmin = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch("http://localhost:8070/api/v1/admin/deleteAdmin");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch admins");
        setAdmins(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAdmins();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate('/');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-white/90 to-white/60 border-r shadow-sm p-4 flex flex-col justify-between">
        <div>
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-800 leading-tight pb-10">
              CEB WELFARE <br /> WPS II
            </h1>
          </div>
          <nav>
            <h2 className="text-xl text-gray-700 font-bold uppercase mb-2">Dashboard</h2>
            <ul className="mb-4 space-y-2">
              <li>
                <button onClick={() => navigate('/dashboard')} className="w-full text-left px-7 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition text-lg">Dashboard</button>
              </li>
              <li>
                <button onClick={() => navigate('/auditLog')} className="w-full text-left px-7 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition text-lg">Audit Logs</button>
              </li>
            </ul>
            <h2 className="text-xl text-gray-700 font-bold uppercase mb-2">Admin Options</h2>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/manageAdmins')} className="w-full text-left px-7 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition text-lg">Manage Admins</button>
              </li>
              <li>
                <button onClick={() => navigate('/manageEmployees')} className="w-full text-left px-7 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition text-lg">Manage Employees</button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="pt-6 pb-5">
          <button onClick={handleLogout} className="w-full text-left px-7 py-2 rounded-md bg-green-500 text-black hover:bg-green-600 transition text-xl text-center font-bold">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-y-auto" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-black/30 z-0" />

        <div className="relative z-10 p-6">
          <h2 className="text-3xl font-bold text-white drop-shadow mb-6">View Admins</h2>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
            {error && (
              <div className="bg-orange-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-orange-600 text-white">
                    <th className="py-3 px-4 border-b">#</th>
                    <th className="py-3 px-4 border-b">EPF Number</th>
                    <th className="py-3 px-4 border-b">Username</th>
                    {/* <th className="py-3 px-4 border-b">Role</th> */}
                  </tr>
                </thead>
                <tbody>
                  {admins.length > 0 ? (
                    admins.map((admin, index) => (
                      <tr key={admin._id} className="hover:bg-orange-50">
                        <td className="py-2 px-4 border-b">{index + 1}</td>
                        <td className="py-2 px-4 border-b">{admin.epfNo}</td>
                        <td className="py-2 px-4 border-b">{admin.username}</td>
                        {/* <td className="py-2 px-4 border-b">{admin.role || "Admin"}</td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-500">
                        No admin data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Link to="/manageAdmins" className="absolute bottom-4 right-6 text-white text-sm hover:underline">
          Back
        </Link>
      </main>
    </div>
  );
};

export default ViewAdmin;
