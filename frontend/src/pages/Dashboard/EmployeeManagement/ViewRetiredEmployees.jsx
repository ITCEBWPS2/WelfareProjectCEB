import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ViewRetiredEmployees = () => {
  const [retiredEmployees, setRetiredEmployees] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRetired = async () => {
      try {
        const res = await fetch('http://localhost:8070/api/v1/retire/viewRetiredEmployees');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch retired employees');
        setRetiredEmployees(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRetired();
  }, []);

  const handleRowClick = (id) => {
    navigate(`/viewRetiredEmployee/${id}`);
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'This retired employee will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
    });

    if (!isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:8070/api/v1/retire/deleteRetiredEmployee/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete retired employee');

      setRetiredEmployees(prev => prev.filter(emp => emp._id !== id));

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Employee deleted successfully.',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.message,
      });
    }
  };

  return (
    <div className="flex">
      <main className="flex-1 relative bg-cover bg-center bg-no-repeat overflow">
        <div className="relative z-10 p-6">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
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
                    <th className="py-3 px-4 border-b">Name with Initials</th>
                    <th className="py-3 px-4 border-b">Welfare Number</th>
                    <th className="py-3 px-4 border-b">Retired Date</th>
                    <th className="py-3 px-4 border-b">Action</th>
                  </tr>
                </thead>
              </table>

              <div className="overflow-y-auto max-h-[calc(9*48px)]">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {retiredEmployees.length > 0 ? (
                      retiredEmployees.map((emp, index) => (
                        <tr
                          key={emp._id}
                          className="hover:bg-orange-50 cursor-pointer"
                          onClick={() => handleRowClick(emp._id)}
                        >
                          <td className="py-2 px-4 border-b">{index + 1}</td>
                          <td className="py-2 px-4 border-b">{emp.epfNumber || '-'}</td>
                          <td className="py-2 px-4 border-b">{emp.name || '-'}</td>
                          <td className="py-2 px-4 border-b">{emp.welfareNumber || '-'}</td>
                          <td className="py-2 px-4 border-b">
                            {emp.retiredDate ? new Date(emp.retiredDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="py-2 px-4 border-b">
                            <button
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(emp._id);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-gray-500">
                          No retired employee data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewRetiredEmployees;
