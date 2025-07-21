import React from 'react'
import { useNavigate} from 'react-router-dom';

const SideBar = () => {
const navigate = useNavigate();

const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate('/');
    }
  };

  return (
    <div>
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
                <button onClick={() => navigate('/manageEmployees')} className="w-full text-left px-7 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition text-lg">Manage Employees</button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="pt-6 pb-5">
          <button onClick={handleLogout} className="w-full text-left px-7 py-2 rounded-md bg-green-500 text-black hover:bg-green-600 transition text-xl text-center font-bold">Logout</button>
        </div>
      </aside>
    </div>
  )
}

export default SideBar
