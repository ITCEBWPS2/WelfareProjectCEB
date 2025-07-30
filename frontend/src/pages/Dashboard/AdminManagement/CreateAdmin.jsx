import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../../images/background.png';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import SideBar from "../SideBar";

const CreateAdmin = () => {
  const [epfNo, setepfNo] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateAdmin = async (e) => {
  e.preventDefault();

  if (!epfNo) return setError("Enter your EPF Number");
  if (!username) return setError("Enter a username");
  if (!password) return setError("Enter a password");
  setError("");

  try {
    const res = await fetch("http://localhost:8070/api/v1/auth/createAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ epfNo, username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create admin");

    // ✅ Show SweetAlert2 popup
    Swal.fire({
      title: 'Success!',
      text: 'Admin created successfully!',
      icon: 'success',
      confirmButtonColor: '#f97316', // orange
      confirmButtonText: 'Go to Manage Admins',
    }).then(() => {
      navigate('/manageAdmins');
    });
  } catch (err) {
    setError(err.message);
  }
};


  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      navigate('/');
    }
  };

  return (
    <div className="flex h-screen">
       {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-y-auto" style={{ backgroundImage: `url(${bgImage})` }}>
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/30 z-0" />

        {/* Title + Form Section */}
        <div className="relative z-10 px-6 pt-6">
          {/* Title in top-left */}
          <h2 className="text-3xl font-bold text-white drop-shadow mb-6">New Admin</h2>

          {/* Centered form */}
          <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-md w-full max-w-md">
              <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">Create New Admin</h2>

              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateAdmin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">EPF Number</label>
                  <input
                    type="text"
                    value={epfNo}
                    onChange={(e) => setepfNo(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <div
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-200"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
         <Link to="/manageAdmins" className="absolute bottom-4 right-6 text-white text-sm cursor-pointer hover:underline">Back</Link>
      </main>
    </div>
  );
};

export default CreateAdmin;
