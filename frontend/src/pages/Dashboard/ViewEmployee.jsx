import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../images/background.png';
import SideBar from '../Dashboard/SideBar';

const ViewEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:8070/api/v1/employee/viewEmployees');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch employees');
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEmployees();
  }, []);


  const handleRowClick = (id) => {
    navigate(`/viewEmployee/${id}`);
  };

  return (
    <div className="flex h-screen">
      <SideBar />
      <main
        className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-y-auto"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 p-6">
          <h2 className="text-3xl font-bold text-white drop-shadow mb-6">View Employees</h2>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
            {error && (
              <div className="bg-orange-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-orange-600 text-white">
                    <th className="py-3 px-4 border-b">#</th>
                    <th className="py-3 px-4 border-b">EPF Number</th>
                    <th className="py-3 px-4 border-b">Name with Initials</th>
                    <th className="py-3 px-4 border-b">Welfare Number</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length > 0 ? (
                    employees.map((emp, index) => (
                      <tr
                        key={emp._id}
                        className="hover:bg-orange-50 cursor-pointer"
                        onClick={() => handleRowClick(emp._id)}
                      >
                        <td className="py-2 px-4 border-b">{index + 1}</td>
                        <td className="py-2 px-4 border-b">{emp.epfNumber}</td>
                        <td className="py-2 px-4 border-b">{emp.name}</td>
                        <td className="py-2 px-4 border-b">{emp.welfareNumber}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-gray-500">
                        No employee data available.
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

export default ViewEmployee;
