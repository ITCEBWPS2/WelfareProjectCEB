import React from 'react'
import { useNavigate} from 'react-router-dom';
import Swal from "sweetalert2";
import logo from '../../images/logo.png';

const SideBar = () => {
  const navigate = useNavigate();
   
  // Assuming the username is stored in localStorage
  const username = localStorage.getItem("username") || "User";  // Replace with your authentication logic

const handleLogout = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, log me out!",
  });

  if (result.isConfirmed) {
    navigate("/login");
  }
};

  return (
    <div>
      <aside className="w-72 bg-gradient-to-b from-white/90 to-white/60 border-r shadow-sm p-4 flex flex-col justify-between">
        <div>
          <div className="text-center mb-6">
            {/* Logo Image */}
            <img
              src={logo} 
              alt="CEB Logo"
              className="mx-auto mb-4 w-16 h-16 object-contain"
            />

            {/* Title */}
            <h1 className="text-xl font-bold text-gray-800 leading-tight pb-2">
              CEB WELFARE <br /> WPS II
            </h1>

            {/* User Greeting */}
            <h2 className="text-lg font-medium text-gray-600 mt-4">
              Hi {username} !!
            </h2>
          </div>

          <nav>
            <h2 className="text-xl text-gray-700 font-bold uppercase mb-2">Dashboard</h2>
            <ul className="mb-4 space-y-2">
              <li>
                <button onClick={() => navigate('/dashboard')} className="w-full text-left px-7 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition text-lg">Dashboard</button>
              </li>
              <li>
                <button onClick={() => navigate('/logs')} className="w-full text-left px-7 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition text-lg">Audit Logs</button>
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
        <br />
        <div className="pt-24 pb-18">
          <button onClick={handleLogout} className="w-full text-left px-7 py-2 rounded-md bg-green-500 text-black hover:bg-green-600 transition text-xl text-center font-bold">Logout</button>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;
