import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../SideBar";
import bgImage from "../../../images/background.png";
import axios from "axios";

const EditAdminForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState({
    epfNo: "",
    username: "",
    role: "",
    password: "",
  });

  const fetchAdmin = async () => {
    try {
      const response = await axios.get(`http://localhost:8070/api/v1/admin/viewAdmin/${id}`);
      setAdmin({
        epfNo: response.data.epfNo || "",
        username: response.data.username || "",
        role: response.data.role || "",
        password: "", // Keep password empty for editing
      });
    } catch (err) {
      Swal.fire("Error", "Failed to fetch admin details", "error");
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({
      ...admin,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = { ...admin };
      if (!updatedData.password) {
        delete updatedData.password; // Don't include password if not provided
      }

      const response = await axios.put(
        `http://localhost:8070/api/v1/admin/updateAdmin/${id}`,
        updatedData
      );

      Swal.fire("Success", "Admin updated successfully", "success").then(() => {
        navigate("/manageAdmins");
      });
    } catch (err) {
      Swal.fire("Error", "Failed to update admin", "error");
    }
  };

  return (
    <div className="flex h-screen">
      <SideBar />
      <main className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-hidden" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 p-6">
          <h2 className="text-3xl font-bold text-white drop-shadow mb-6">Edit Admin</h2>
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-md max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* EPF Number */}
              <div className="flex flex-col">
                <label htmlFor="epfNo" className="text-sm font-medium text-gray-700 mb-1">
                  EPF Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="epfNo"
                  name="epfNo"
                  value={admin.epfNo || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              {/* Username */}
              <div className="flex flex-col">
                <label htmlFor="username" className="text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={admin.username || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              {/* Role */}
              <div className="flex flex-col">
                <label htmlFor="role" className="text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={admin.role || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={admin.password || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                Update Admin
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditAdminForm;
