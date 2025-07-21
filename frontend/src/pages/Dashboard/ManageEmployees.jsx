import React from 'react';
import { Users, UserPlus, UserCog, UserX } from 'lucide-react';
import bgImage from '../../images/background.png';
import { useNavigate, Link } from 'react-router-dom';

const ManageEmployees = () => {
  const navigate = useNavigate();

  const employeeActions = [
    { title: 'New Employee', icon: <UserPlus size={24} className="text-orange-600" />, path: '/addMember' },
    { title: 'View Employee', icon: <Users size={24} className="text-orange-600" />, path: '/viewMembers' },
    { title: 'Update Employee', icon: <UserCog size={24} className="text-orange-600" />, path: '/editMember' },
    { title: 'Delete Employee', icon: <UserX size={24} className="text-orange-600" />, path: '/deleteMember' },
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
                <button className="w-full text-left px-7 py-2 rounded-md text-gray-700 bg-orange-200 transition text-lg">Manage Employees</button>
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
                  className="bg-white/90 shadow-md rounded-2xl p-8 text-xl font-semibold hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer hover:bg-orange-100 flex items-center justify-center space-x-3"
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
