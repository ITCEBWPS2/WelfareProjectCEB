import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreateLoan = () => {
  const initialFormData = {
    epfNumber: "",
    name: "",
    NIC: "",
    loanAmount: "",
    role: "",
    reason: "",
    loanDate: "",
    status: "pending"
  };

  const [formData, setFormData] = useState(initialFormData);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "epfNumber") {
      if (value.trim().length > 0) {
        fetch(`http://localhost:8070/api/v1/employee/search?epf=${value}`)
          .then((res) => res.json())
          .then((data) => {
            setSuggestions(data);
            setShowSuggestions(true);
          })
          .catch((err) => console.error("Error fetching suggestions", err));
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const handleSelectSuggestion = (emp) => {
    setFormData((prev) => ({
      ...prev,
      epfNumber: emp.epfNumber,
      name: emp.name
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirm = await Swal.fire({
      title: "Confirm Loan Submission",
      text: "Do you want to submit this loan application?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d97706",
      confirmButtonText: "Submit",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("http://localhost:8070/api/v1/loans/createLoan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create loan");

      Swal.fire("Success", "Loan created successfully!", "success");
      
      // Reset form and suggestions
      setFormData(initialFormData);
      setSuggestions([]);
      setShowSuggestions(false);

      navigate("/loansManagement");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="flex">
      <main className="flex-1 bg-cover bg-center bg-no-repeat overflow-y-auto">
        <div className="relative z-10 p-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* EPF Number Autocomplete */}
              <div className="relative">
                <label className="block mb-1 font-semibold text-gray-700">
                  EPF Number
                </label>
                <input
                  type="text"
                  name="epfNumber"
                  value={formData.epfNumber}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute bg-white border rounded mt-1 w-full max-h-40 overflow-y-auto z-20 shadow">
                    {suggestions.map((emp) => (
                      <li
                        key={emp._id}
                        onClick={() => handleSelectSuggestion(emp)}
                        className="px-4 py-2 cursor-pointer hover:bg-orange-100"
                      >
                        {emp.epfNumber} - {emp.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* NIC */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">NIC</label>
                <input
                  type="text"
                  name="NIC"
                  value={formData.NIC}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* Loan Amount */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Loan Amount (Rs)</label>
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* Loan Date */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Loan Request Date</label>
                <input
                  type="date"
                  name="loanDate"
                  value={formData.loanDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* Reason */}
              <div className="md:col-span-2">
                <label className="block mb-1 font-semibold text-gray-700">Reason for Loan</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={3}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded"
              >
                Submit Loan
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateLoan;
