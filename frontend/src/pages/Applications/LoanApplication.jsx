import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const LoanApplication = ({ onClose }) => {
  const [members, setMembers] = useState([]);
  const [filteredEPFs, setFilteredEPFs] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [loanCount, setLoanCount] = useState(0);
  const [showLoanCountMessage, setShowLoanCountMessage] = useState(false);

  const [loadingLoanCount, setLoadingLoanCount] = useState(false);
  // NEW STATE: To indicate if the loan number is currently being generated
  const [loadingLoanNumber, setLoadingLoanNumber] = useState(true);

  const [formData, setFormData] = useState({
    epf: "",
    loanNumber: "", // This will be auto-generated
    loanAmount: "",
    customLoanAmount: "",
    dateOfBirth: "",
  });

  const showLoanCountPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  const fetchLoanNumber = useCallback(async () => {
    setLoadingLoanNumber(true); // Set loading to true when starting fetch
    try {
      const response = await axios.get(
        `${BASE_URL}/api/loans/util/generate-loan-number`,
        { withCredentials: true }
      );
      if (response.data) {
        setFormData((prev) => ({ ...prev, loanNumber: response.data }));
      }
    } catch (error) {
      console.error("Error fetching loan number:", error.message);
      toast.error("Failed to generate loan number.");
      setFormData((prev) => ({ ...prev, loanNumber: "Error" })); // Show error state
    } finally {
      setLoadingLoanNumber(false); // Set loading to false when fetch ends
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/members`, {
        withCredentials: true,
      });
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to fetch member list for suggestions.");
    }
  }, []);

  const fetchApprovedLoanCount = useCallback(async (epf) => {
    setLoadingLoanCount(true);
    setShowLoanCountMessage(true);

    if (!epf) {
      setLoanCount(0);
      setLoadingLoanCount(false);
      setShowLoanCountMessage(false); // Hide if EPF becomes empty
      return 0;
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/api/loans/approved-count/${epf}`,
        {
          withCredentials: true,
        }
      );
      setLoanCount(response.data.count);
      return response.data.count;
    } catch (error) {
      console.error("Error fetching approved loan count:", error);
      setLoanCount(0);
      setShowLoanCountMessage(true); // Keep message visible, show 0 on error
      return 0;
    } finally {
      setLoadingLoanCount(false);
    }
  }, []);

  useEffect(() => {
    fetchLoanNumber(); // This will now set loadingLoanNumber and fetch
    fetchMembers();
  }, [fetchLoanNumber, fetchMembers]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "epf") {
      const lowerEPF = value.toLowerCase();
      setShowSuggestions(true);
      setFilteredEPFs(
        members.filter((member) =>
          member.epf.toLowerCase().includes(lowerEPF)
        )
      );

      if (value.length >= 5) {
        const count = await fetchApprovedLoanCount(value);
        showLoanCountPopup(`This member has ${count} approved loan(s).`);
      } else {
        setLoanCount(0);
        setShowPopup(false);
        setLoadingLoanCount(false);
        // If EPF input is cleared, hide the inline count message
        if (value.length === 0) {
          setShowLoanCountMessage(false);
        } else {
          // If less than 5 but not empty, show 0 and keep message visible
          setShowLoanCountMessage(true);
        }
      }
    }
  };

  const handleSuggestionClick = async (epf) => {
    setFormData((prev) => ({ ...prev, epf }));
    setShowSuggestions(false);

    const count = await fetchApprovedLoanCount(epf);
    showLoanCountPopup(`This member has ${count} approved loan(s).`);

    const selectedMember = members.find(member => member.epf === epf);
    if (selectedMember && selectedMember.dateOfBirth) {
      setFormData(prev => ({
        ...prev,
        dateOfBirth: new Date(selectedMember.dateOfBirth).toISOString().split('T')[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.epf || !formData.loanAmount || !formData.dateOfBirth) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const requiredDate = new Date();
    const retirementDate = new Date();

    const monthDifference =
      retirementDate.getFullYear() * 12 +
      retirementDate.getMonth() -
      (requiredDate.getFullYear() * 12 + requiredDate.getMonth());

    if (monthDifference < 10) {
      const confirmation = window.confirm(
        "There should be a minimum of 10 months gap between the Required Loan Date and Retirement Date. Do you want to proceed despite this? (Note: Required Loan Date and Retirement Date fields are not in this form.)"
      );

      if (!confirmation) {
        return;
      }
    }

    const finalLoanAmount =
      formData.loanAmount === "other" && formData.customLoanAmount
        ? formData.customLoanAmount
        : formData.loanAmount;

    const dataToSubmit = {
      epf: formData.epf,
      loanNumber: formData.loanNumber,
      loanAmount: finalLoanAmount,
      dateOfBirth: formData.dateOfBirth,
      loanStatus: "pending",
    };

    try {
      const response = await axios.post(`${BASE_URL}/api/loans`, dataToSubmit, {
        withCredentials: true,
      });
      toast.success(
        response.data.message || "Loan application submitted successfully!"
      );
      setFormData({
        epf: "",
        loanNumber: "",
        loanAmount: "",
        customLoanAmount: "",
        dateOfBirth: "",
      });
      setLoanCount(0);
      setShowLoanCountMessage(false);
      setShowPopup(false);
      fetchLoanNumber(); // Fetch a new loan number for the next form
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error submitting loan application:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit loan application.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg relative my-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">New Loan</h2>
        <p className="text-gray-600 mb-6 text-center">
          Please fill this form to give a loan.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="relative">
              <label
                htmlFor="epf"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                EPF Number
              </label>
              <input
                id="epf"
                type="text"
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
              {showLoanCountMessage && formData.epf && (
                <p className="text-sm text-gray-700 mt-2">
                  Approved Loan(s) Count:{" "}
                  <span className="font-semibold">
                    {loadingLoanCount ? "Loading..." : loanCount}
                  </span>
                </p>
              )}

              {showSuggestions && filteredEPFs.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
                  {filteredEPFs.map((member) => (
                    <li
                      key={member._id}
                      onClick={() => handleSuggestionClick(member.epf)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {member.epf} - {member.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label
                htmlFor="loanNumber"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Loan Number
              </label>
              <input
                id="loanNumber"
                type="text"
                name="loanNumber"
                // Display "Generating..." if loading, otherwise the number
                value={loadingLoanNumber ? "Generating..." : formData.loanNumber}
                readOnly
                disabled
                className="appearance-none bg-gray-100 border-b-2 border-gray-300 w-full text-gray-900 p-3 leading-tight focus:outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label
                htmlFor="loanAmount"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Loan Amount
              </label>
              <select
                id="loanAmount"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                required
                className="appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-3 leading-tight focus:outline-none focus:border-red-500"
              >
                <option value="">Select Loan Amount</option>
                <option value="50000">50,000</option>
                <option value="100000">100,000</option>
                <option value="150000">150,000</option>
                <option value="other">Other</option>
              </select>
              {formData.loanAmount === "other" && (
                <input
                  type="number"
                  name="customLoanAmount"
                  placeholder="Enter custom loan amount"
                  value={formData.customLoanAmount}
                  onChange={handleChange}
                  required
                  className="mt-2 appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-3 leading-tight focus:outline-none focus:border-red-500"
                />
              )}
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                placeholder="dd / mm / yyyy"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="appearance-none bg-transparent border-b-2 border-gray-300 w-full text-gray-900 p-3 leading-tight focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3 font-semibold bg-orange-600 text-white rounded-md hover:bg-orange-800 transition"
          >
            Submit Loan Application
          </button>
        </form>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
              <p className="mb-4 text-lg">{popupMessage}</p>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
              >
                OK
              </button>
            </div>
          </div>
        )}

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

export default LoanApplication;