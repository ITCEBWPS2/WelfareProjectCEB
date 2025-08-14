import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateEmployee = () => {
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

  const handleUpdateClick = (id) => {
    navigate(`/updateEmployee/${id}`);
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8070/api/v1/employee/deleteEmployee/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete employee');

      // Remove deleted employee from the list
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex">
      
      <main
        className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-y-auto">
        <div className="relative z-10 p-6">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
            {error && (
              <div className="bg-orange-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>
            )}

            {/* Scrollable table container */}
            <div className="overflow-y-auto max-h-[450px] overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-orange-600 text-white">
                    <th className="py-3 px-4 border-b">#</th>
                    <th className="py-3 px-4 border-b">EPF Number</th>
                    <th className="py-3 px-4 border-b">Name</th>
                    <th className="py-3 px-4 border-b">Welfare Number</th>
                    <th className="py-3 px-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length > 0 ? (
                    employees.map((emp, index) => (
                      <tr key={emp._id} className="hover:bg-orange-50">
                        <td className="py-2 px-4 border-b">{index + 1}</td>
                        <td className="py-2 px-4 border-b">{emp.epfNumber}</td>
                        <td className="py-2 px-4 border-b">{emp.name}</td>
                        <td className="py-2 px-4 border-b">{emp.welfareNumber}</td>
                        <td className="py-2 px-4 border-b">
                          <button
                            onClick={() => handleUpdateClick(emp._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm mr-2"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteClick(emp._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
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

export default UpdateEmployee;
