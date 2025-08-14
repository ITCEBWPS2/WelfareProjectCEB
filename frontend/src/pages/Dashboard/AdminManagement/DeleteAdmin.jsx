import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from "../SideBar";
import Swal from 'sweetalert2';

const DeleteAdmin = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

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

  const handleDelete = async (adminId) => {
  const confirm = window.confirm("Are you sure you want to delete this admin?");
  if (!confirm) return;

  try {
    const res = await fetch(`http://localhost:8070/api/v1/admin/deleteAdmin/${adminId}`, {
      method: "DELETE",
    });

    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      const errorMsg = contentType.includes("application/json")
        ? (await res.json()).message
        : "Unexpected server error or HTML response.";
      throw new Error(errorMsg);
    }

    // ✅ Show SweetAlert2 popup
    await Swal.fire({
      title: 'Success!',
      text: 'Admin deleted successfully!',
      icon: 'success',
      confirmButtonColor: '#f97316',
      confirmButtonText: 'Go to Manage Admins',
    });

    navigate('/manageAdmins');
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div className="flex">
      <main className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-y-auto">
        
        <div className="relative z-10 p-6">
          

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
                    <th className="py-3 px-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length > 0 ? (
                    admins.map((admin, index) => (
                      <tr key={admin._id} className="hover:bg-orange-50">
                        <td className="py-2 px-4 border-b">{index + 1}</td>
                        <td className="py-2 px-4 border-b">{admin.epfNo}</td>
                        <td className="py-2 px-4 border-b">{admin.username}</td>
                        <td className="py-2 px-4 border-b">
                          <button
                            onClick={() => handleDelete(admin._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        No admin data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeleteAdmin;
