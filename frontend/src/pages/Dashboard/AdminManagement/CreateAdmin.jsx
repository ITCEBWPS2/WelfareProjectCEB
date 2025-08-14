import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

const CreateAdminForm = () => {
  const [epfNo, setEpfNo] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const navigate = useNavigate();

  // Fetch employees for EPF suggestions
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:8070/api/v1/employee/viewEmployees");
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees", err);
      }
    };
    fetchEmployees();

    // Disable body scrolling
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleEpfChange = (e) => {
    const value = e.target.value;
    setEpfNo(value);
    const filtered = employees.filter(emp =>
      emp.epfNumber.toString().includes(value) ||
      emp.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const handleSelectEmployee = (emp) => {
    setEpfNo(emp.epfNumber);
    setFilteredEmployees([]);
  };

  const handleCreateAdmin = async (e) => {
  e.preventDefault();
  if (!epfNo) return setError("Enter your EPF Number");
  if (!username) return setError("Enter a username");
  if (!password) return setError("Enter a password");
  if (!role) return setError("Enter a role");
  setError("");

  try {
    const res = await fetch("http://localhost:8070/api/v1/auth/createAdmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ epfNo, username, password, role }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create admin");

    await Swal.fire({
      title: 'Success!',
      text: 'Admin created successfully!',
      icon: 'success',
      confirmButtonColor: '#f97316',
    });

    // Reset form fields
    setEpfNo("");
    setUsername("");
    setPassword("");
    setRole("");
    setShowPassword(false);
    setFilteredEmployees([]);
    setError(null);

    // Optional: navigate to manageAdmins page
    // navigate('/manageAdmins');
  } catch (err) {
    setError(err.message);
  }
};


  return (
    <div className=" flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md relative">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-4">
          Create New Admin
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleCreateAdmin} className="space-y-5">
          {/* EPF Number with suggestions */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">EPF Number</label>
            <input
              type="text"
              value={epfNo}
              onChange={handleEpfChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            {filteredEmployees.length > 0 && (
              <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                {filteredEmployees.map((emp) => (
                  <li
                    key={emp._id}
                    className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                    onClick={() => handleSelectEmployee(emp)}
                  >
                    {emp.epfNumber} - {emp.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Username */}
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

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Password */}
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
  );
};

export default CreateAdminForm;
