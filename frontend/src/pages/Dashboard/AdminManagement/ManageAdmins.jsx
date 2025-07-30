import React from 'react';
import bgImage from '../../../images/background.png';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Users, KeyRound, UserX } from 'lucide-react';
import { Link } from 'react-router-dom';
import SideBar from "../SideBar";


const ManageAdmins = () => {
  const navigate = useNavigate();

  const adminActions = [
  { title: 'New Admins', icon: <UserPlus size={24} className="text-orange-600" />, path: '/createAdmin'},
  { title: 'View Admins', icon: <Users size={24} className="text-orange-600" />, path: '/viewAdmin' },
  { title: 'Update Admins', icon: <KeyRound size={24} className="text-orange-600" />, path: '/updateAdmin'},
  { title: 'Delete Admins', icon: <UserX size={24} className="text-orange-600" />,path: '/deleteAdmin' },
];

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
      <main
        className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-y-auto"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 p-6">
          {/* Title */}
          <h2 className="text-3xl font-bold text-white drop-shadow mb-6">Manage Admins</h2>

          {/* Admin Action Buttons */}
          <div className="p-6 min-h-[calc(100vh-150px)] flex items-center justify-center">
            <div className="grid grid-cols-2 gap-8 w-full max-w-3xl">
              {adminActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="bg-white/90 shadow-md rounded-2xl p-8 text-xl font-semibold hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer hover:bg-orange-100 flex items-center justify-center space-x-3 border-t-4 border-orange-500"
                >
                  {action.icon}
                  <span>{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <Link to="/dashboard" className="absolute bottom-4 right-6 text-white text-sm cursor-pointer hover:underline">Back</Link>
      </main>
    </div>
  );
};

export default ManageAdmins;
