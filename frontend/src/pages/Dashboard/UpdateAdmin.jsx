import React, { useEffect, useState } from 'react';
import bgImage from '../../images/background.png';
import { useNavigate, Link } from 'react-router-dom';
import SideBar from "./SideBar";
import Swal from 'sweetalert2';

const UpdateAdmin = () => {
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

    const handleEditAdmin = async (admin) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Admin',
      html: `
        <input id="swal-epf" class="swal2-input" placeholder="EPF Number" value="${admin.epfNo}">
        <input id="swal-username" class="swal2-input" placeholder="Username" value="${admin.username}">
        <input id="swal-password" class="swal2-input" placeholder="New Password (optional)" type="password">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: () => {
        return {
          epfNo: document.getElementById('swal-epf').value,
          username: document.getElementById('swal-username').value,
          password: document.getElementById('swal-password').value,
        };
      }
    });

    if (!formValues) return;

    try {
      const res = await fetch(`http://localhost:8070/api/v1/admin/updateAdmin/${admin._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update admin");

      Swal.fire({
        title: 'Updated!',
        text: 'Admin information updated successfully.',
        icon: 'success',
        confirmButtonColor: '#f97316',
      });

      // Optional: refresh the admin list
      fetchAdmins();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.message,
        confirmButtonColor: '#dc2626',
      });
    }
  };


  return (
    <div className="flex h-screen">
      <SideBar />
      <main className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-y-auto" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 p-6">
          <h2 className="text-3xl font-bold text-white drop-shadow mb-6">Update Admin</h2>

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
                            onClick={() => handleEditAdmin(admin)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                           Edit Admin
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

        <Link to="/manageAdmins" className="absolute bottom-4 right-6 text-white text-sm hover:underline">
          Back
        </Link>
      </main>
    </div>
  );
};

export default UpdateAdmin;
