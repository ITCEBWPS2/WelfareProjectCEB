import React, { useEffect, useState } from 'react';
import bgImage from '../../../images/background.png';
import { useNavigate, Link } from 'react-router-dom';
import SideBar from "../../Dashboard/SideBar";
import Swal from 'sweetalert2';

const ViewRetiredEmployees = () => {
  const navigate = useNavigate();
  const [retiredEmployees, setRetiredEmployees] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRetired();
  }, []);

  const fetchRetired = async () => {
    try {
      const res = await fetch(`http://localhost:8070/api/v1/retire/viewRetiredEmployees`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch retired employees");
      setRetiredEmployees(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: "This retired employee will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:8070/api/v1/retire/deleteRetiredEmployee/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete retired employee");

      setRetiredEmployees(prev => prev.filter(emp => emp._id !== id));

      Swal.fire({
         title: 'Success!',
      text: 'Admin deleted successfully!',
      icon: 'success',
      confirmButtonColor: '#f97316',
      confirmButtonText: 'Go to Manage Employees',
      });
      navigate('/viewRetiredEmployees');
      } catch (err) {
        setError(err.message);
        }
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
          <h2 className="text-3xl font-bold text-white drop-shadow mb-6">Retired Employees</h2>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-6xl mx-auto">
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
                    <th className="py-3 px-4 border-b">Name</th>
                    <th className="py-3 px-4 border-b">Welfare Number</th>
                    <th className="py-3 px-4 border-b">Retired Date</th>
                    <th className="py-3 px-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {retiredEmployees.length > 0 ? (
                    retiredEmployees.map((emp, index) => (
                      <tr key={emp._id} className="hover:bg-orange-50">
                        <td className="py-2 px-4 border-b">{index + 1}</td>
                        <td className="py-2 px-4 border-b">{emp.epfNumber}</td>
                        <td className="py-2 px-4 border-b">{emp.name}</td>
                        <td className="py-2 px-4 border-b">{emp.welfareNumber}</td>
                        <td className="py-2 px-4 border-b">
                          {emp.retiredDate
                            ? new Date(emp.retiredDate).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button
                            onClick={() => handleDelete(emp._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
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

        <Link to="/manageEmployees" className="absolute bottom-4 right-6 text-white text-sm hover:underline">
          Back
        </Link>
      </main>
    </div>
  );
};

export default ViewRetiredEmployees;
