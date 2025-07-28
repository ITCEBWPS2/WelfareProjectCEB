import React from 'react';
import { Users, UserPlus, UserCog, Briefcase  } from 'lucide-react';
import bgImage from '../../images/background.png';
import { useNavigate, Link } from 'react-router-dom';
import SideBar from "../Dashboard/SideBar";

const ManageEmployees = () => {
  const navigate = useNavigate();

  const employeeActions = [
    { title: 'New Employee', icon: <UserPlus size={24} className="text-red-950" />, path: '/createEmployee' },
    { title: 'View Employee', icon: <Users size={24} className="text-red-950" />, path: '/viewEmployees' },
    { title: 'Update Employee', icon: <UserCog size={24} className="text-red-950" />, path: '/updateEmployee' },
    { title: 'Retired Employee', icon: <Briefcase  size={24} className="text-red-950" />, path: '/viewRetiredEmployees' },
  ];

  // const handleLogout = () => {
  //   const confirmLogout = window.confirm("Are you sure you want to log out?");
  //   if (confirmLogout) {
  //     navigate('/');
  //   }
  // };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-y-auto" style={{ backgroundImage: `url(${bgImage})` }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 p-6">
          {/* Title */}
          <h2 className="text-3xl font-bold text-white drop-shadow mb-6">Manage Employees</h2>

          {/* Employee Actions */}
          <div className="p-6 min-h-[calc(100vh-150px)] flex items-center justify-center">
            <div className="grid grid-cols-2 gap-8 w-full max-w-3xl">
              {employeeActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="bg-white/90 text-slate-600 shadow-md rounded-2xl p-8 text-xl font-semibold hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer hover:bg-red-100 flex items-center justify-center space-x-3 border-b-4 border-red-950"
                >
                  {action.icon}
                  <span>{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Back link */}
        <Link to="/dashboard" className="absolute bottom-4 right-6 text-white text-sm cursor-pointer hover:underline">Back</Link>
      </main>
    </div>
  );
};

export default ManageEmployees;
