import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreateRetirementGift = () => {
  const initialFormData = {
    epfNumber: "",
    name: "",
    dateJoined: "",
    dateOfRetire: "",
    giftType: "",
    giftDescription: "",
    giftValue: "",
    disbursementMethod: "",
    disbursementDate: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  // Handle input changes and EPF suggestions
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
      dateJoined: emp.dateJoined ? emp.dateJoined.substring(0, 10) : "",
    }));
    setShowSuggestions(false);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: "Confirm Retirement Gift Submission",
      text: "Do you want to submit this retirement gift record?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d97706",
      confirmButtonText: "Submit",
    });

    if (!confirm.isConfirmed) return;

    try {
      const payload = {
        epfNumber: formData.epfNumber,
        name: formData.name,
        dateJoined: formData.dateJoined,
        dateOfRetire: formData.dateOfRetire,
        giftDetails: {
          giftType: formData.giftType,
          giftDescription: formData.giftDescription,
          giftValue: Number(formData.giftValue),
          disbursementMethod: formData.disbursementMethod,
          disbursementDate: formData.disbursementDate,
        },
      };

      const res = await fetch(
        "http://localhost:8070/api/v1/retirementGifts/createRetirementGift",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create retirement gift record");

      Swal.fire("Success", "Retirement gift record created successfully!", "success");

      setFormData(initialFormData);
      setSuggestions([]);
      setShowSuggestions(false);

      navigate("/retirementGiftManagement");
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

              {/* Date Joined */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Date Joined</label>
                <input
                  type="date"
                  name="dateJoined"
                  value={formData.dateJoined}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* Date of Retirement */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Date of Retirement</label>
                <input
                  type="date"
                  name="dateOfRetire"
                  value={formData.dateOfRetire}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* Gift Type */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Gift Type</label>
                <select
                  name="giftType"
                  value={formData.giftType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                >
                  <option value="">Select</option>
                  <option value="Cash">Cash</option>
                  <option value="Item">Item</option>
                  <option value="Voucher">Voucher</option>
                </select>
              </div>

              {/* Gift Description */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Gift Description</label>
                <input
                  type="text"
                  name="giftDescription"
                  value={formData.giftDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* Gift Value */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Gift Value (Rs)</label>
                <input
                  type="number"
                  name="giftValue"
                  value={formData.giftValue}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* Disbursement Method */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Disbursement Method</label>
                <select
                  name="disbursementMethod"
                  value={formData.disbursementMethod}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                >
                  <option value="">Select</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Handed in Ceremony">Handed in Ceremony</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Disbursement Date */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Disbursement Date</label>
                <input
                  type="date"
                  name="disbursementDate"
                  value={formData.disbursementDate}
                  onChange={handleChange}
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
                Submit Retirement Gift
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateRetirementGift;
