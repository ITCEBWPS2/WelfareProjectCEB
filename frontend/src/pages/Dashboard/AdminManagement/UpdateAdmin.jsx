// src/pages/Dashboard/AdminManagement/UpdateAdmin.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const UpdateAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    epfNo: "",
    username: "",
    role: "",
    password: "",
  });

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

  const openModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      epfNo: admin.epfNo || "",
      username: admin.username || "",
      role: admin.role || "",
      password: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAdmin(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.epfNo || !formData.username) {
      Swal.fire("Error", "EPF number and username are required", "error");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8070/api/v1/admin/updateAdmin/${selectedAdmin._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update admin");

      Swal.fire("Success", "Admin updated successfully", "success");
      closeModal();
      fetchAdmins();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="flex">
      <main className="flex-1 relative bg-cover bg-center bg-no-repeat">
        <div className="relative z-10 p-6">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
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
                    <th className="py-3 px-4 border-b">Role</th>
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
                        <td className="py-2 px-4 border-b">{admin.role}</td>
                        <td className="py-2 px-4 border-b">
                          <button
                            onClick={() => openModal(admin)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-4 text-gray-500"
                      >
                        No admin data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                ✖
              </button>

              <h2 className="text-2xl font-bold text-orange-600 mb-4">
                Update Admin
              </h2>

              <form onSubmit={handleUpdate} className="space-y-4">
                {/* EPF Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    EPF Number
                  </label>
                  <input
                    type="text"
                    name="epfNo"
                    value={formData.epfNo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UpdateAdmin;
