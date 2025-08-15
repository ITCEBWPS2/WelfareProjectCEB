import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreateDeathFund = () => {
  const initialFormData = {
    epfNumber: "",
    name: "",
    contactNumber: "",
    dateOfDeath: "",
    beneficiaryType: "",
    beneficiaryName: "",
    fundAmount: "",
    fundDate: "",
    fundType: "",
    paymentMethod: "",
    status: "pending",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  // Handle form changes and EPF suggestions
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
      name: emp.name,
    }));
    setShowSuggestions(false);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: "Confirm Death Fund Submission",
      text: "Do you want to submit this death fund record?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d97706",
      confirmButtonText: "Submit",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("http://localhost:8070/api/v1/deathfunds/createDeathFund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create death fund record");

      Swal.fire("Success", "Death fund record created successfully!", "success");

      // Reset form and suggestions
      setFormData(initialFormData);
      setSuggestions([]);
      setShowSuggestions(false);

      navigate("/deathFundManagement");
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

              {/* Contact Number */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* Date of Death */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Date of Death</label>
                <input
                  type="date"
                  name="dateOfDeath"
                  value={formData.dateOfDeath}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* Beneficiary Type */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Beneficiary Type</label>
                <select
                  name="beneficiaryType"
                  value={formData.beneficiaryType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                >
                  <option value="">Select</option>
                  <option value="mother">Mother</option>
                  <option value="father">Father</option>
                  <option value="mother in law">Mother-in-law</option>
                  <option value="father in law">Father-in-law</option>
                  <option value="children">Children</option>
                </select>
              </div>

              {/* Beneficiary Name */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Beneficiary Name</label>
                <input
                  type="text"
                  name="beneficiaryName"
                  value={formData.beneficiaryName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* Fund Amount */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Fund Amount (Rs)</label>
                <input
                  type="number"
                  name="fundAmount"
                  value={formData.fundAmount}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* Fund Date */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Fund Date</label>
                <input
                  type="date"
                  name="fundDate"
                  value={formData.fundDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* Fund Type */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Fund Type</label>
                <select
                  name="fundType"
                  value={formData.fundType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                >
                  <option value="">Select</option>
                  <option value="monthly">Monthly</option>
                  <option value="one time">One Time</option>
                  <option value="special">Special</option>
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                >
                  <option value="">Select</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded"
              >
                Submit Death Fund
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateDeathFund;
