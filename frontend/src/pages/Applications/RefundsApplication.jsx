import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const RefundForm = ({ onClose }) => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    epf: "",
    amount: "",
    reason: "",
    message: "",
  });
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchMembers = async () => {
    try {
      const memberFetch = await axios.get(`${BASE_URL}/api/members`, {
        withCredentials: true,
      });
      setMembers(memberFetch.data);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to fetch member list for EPF suggestions.");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "epf") {
      const suggestions = members.filter((member) =>
        member.epf.toString().toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMembers(suggestions);
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (epf) => {
    setFormData((prev) => ({ ...prev, epf }));
    setFilteredMembers([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/api/refunds`, formData, {
        withCredentials: true,
      });
      toast.success("Refund request submitted successfully!");
      setFormData({
        epf: "",
        amount: "",
        reason: "",
        message: "",
      });
      setFilteredMembers([]);
      setShowSuggestions(false);
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error submitting refund form:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("There was an error submitting the form.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg relative my-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">Request Refund</h2>
        <p className="text-gray-600 mb-6 text-center">
          Please fill out this form to request a refund.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6">
            <div className="relative">
              <label htmlFor="epf" className="block mb-2 text-sm font-medium text-gray-600">
                EPF Number
              </label>
              <input
                type="text"
                id="epf"
                name="epf"
                placeholder="Enter EPF Number"
                value={formData.epf}
                onChange={handleChange}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() => {
                  if (members.length === 0) fetchMembers();
                  setShowSuggestions(true);
                }}
                autoComplete="off"
                required
                className="appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-3 leading-tight focus:outline-none focus:border-red-500"
              />
              {showSuggestions && filteredMembers.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
                  {filteredMembers.map((member) => (
                    <li
                      key={member._id}
                      onClick={() => handleSuggestionClick(member.epf)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {member.epf} - {member.name || "N/A"}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-600">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="Enter refund amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className="appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-3 leading-tight focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label htmlFor="reason" className="block mb-2 text-sm font-medium text-gray-600">
                Reason
              </label>
              <textarea
                id="reason"
                name="reason"
                placeholder="Briefly state the reason for the refund"
                value={formData.reason}
                onChange={handleChange}
                rows="3"
                className="appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-3 leading-tight focus:outline-none focus:border-red-500 resize-y"
              ></textarea>
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-600">
                Additional Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Provide any additional details or context"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                className="appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-3 leading-tight focus:outline-none focus:border-red-500 resize-y"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3 font-semibold bg-orange-600 text-white rounded-md hover:bg-orange-800 transition"
          >
            Submit Refund
          </button>
        </form>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundForm;