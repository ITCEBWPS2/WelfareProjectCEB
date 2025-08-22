import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreateScholarship = () => {
  const initialFormData = {
    epfNumber: "",
    name: "",
    childName: "",
    grade: "",
    school: "",
    scholarshipType: "",
    academicPerformance: "",
    status: "pending",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Autocomplete EPF number
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirm = await Swal.fire({
      title: "Confirm Scholarship Submission",
      text: "Do you want to submit this scholarship application?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d97706",
      confirmButtonText: "Submit",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        "http://localhost:8070/api/v1/scholarships/createScholarship",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create scholarship");

      Swal.fire("Success", "Scholarship created successfully!", "success");

      setFormData(initialFormData);
      setSuggestions([]);
      setShowSuggestions(false);

      navigate("/scholarshipManagement");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="flex">
      <main className="flex-1 bg-fixed bg-cover bg-center bg-no-repeat overflow-y-auto">
        <div className="relative z-10 p-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* EPF Number Autocomplete */}
              <div className="relative">
                <label className="block mb-1 font-semibold text-gray-700">EPF Number</label>
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

              {/* Child Name */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Child Name</label>
                <input
                  type="text"
                  name="childName"
                  value={formData.childName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* Grade */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Grade</label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* School */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">School</label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>

              {/* Scholarship Type */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Scholarship Type</label>
                <select
                  name="scholarshipType"
                  value={formData.scholarshipType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                >
                  <option value="">Select Type</option>
                  <option value="Academic Excellence">Academic Excellence</option>
                  <option value="Financial Need">Financial Need</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Academic Performance */}
              <div className="md:col-span-2">
                <label className="block mb-1 font-semibold text-gray-700">Academic Performance</label>
                <textarea
                  name="academicPerformance"
                  value={formData.academicPerformance}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded border focus:outline-orange-500"
                />
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded"
              >
                Submit Scholarship
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateScholarship;
