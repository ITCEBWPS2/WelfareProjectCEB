import React, { useEffect, useState } from 'react';
import bgImage from '../../../images/background.png';
import { useNavigate, Link } from 'react-router-dom';
import SideBar from "../SideBar";

const ViewAdmin = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch("http://localhost:8070/api/v1/admin/viewAdmin");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch admins");
        setAdmins(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SideBar />

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
