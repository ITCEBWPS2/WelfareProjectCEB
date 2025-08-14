import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:8070/api/v1/loans";

const FilteredLoanList = ({ statusFilter }) => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // Fetch loans on component mount or whenever statusFilter changes
  useEffect(() => {
    fetchLoans();
  }, [statusFilter]);

  const fetchLoans = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/viewLoans`);
      const filtered = statusFilter
        ? res.data.filter((loan) => loan.status === statusFilter)
        : res.data;
      setLoans(filtered);
    } catch (err) {
      console.error("Error fetching loans:", err);
    }
  };

  const updateStatus = async (id, status) => {
    const result = await Swal.fire({
      title: `Confirm ${status}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${BASE_URL}/updateStatus/${id}`, { status });
        Swal.fire("Success", `Loan ${status} successfully`, "success");
        setSelectedLoan(null);
        fetchLoans();
      } catch (err) {
        Swal.fire("Error", "Failed to update loan status", "error");
      }
    }
  };

  const deleteLoan = async (id) => {
    const result = await Swal.fire({
      title: "Delete Loan?",
      text: "This action is permanent!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/deleteLoan/${id}`);
        Swal.fire("Deleted!", "Loan has been deleted.", "success");
        setSelectedLoan(null);
        fetchLoans();
      } catch (err) {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };

  return (
    <div className="p-6">
      {/* Loan Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-orange-500 text-white text-left">
              <th className="p-3">#</th>
              <th className="p-3">EPF Number</th>
              <th className="p-3">Name</th>
              <th className="p-3">Loan Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, index) => (
              <tr
                key={loan._id}
                className="border-b hover:bg-orange-50 transition"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{loan.epfNumber}</td>
                <td className="p-3">{loan.name}</td>
                <td className="p-3">Rs. {loan.loanAmount}</td>
                <td className="p-3">
                  <span
                    className={`font-semibold ${
                      loan.status === "approved"
                        ? "text-green-600"
                        : loan.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {loan.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  {loan.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(loan._id, "approved")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(loan._id, "rejected")}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteLoan(loan._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedLoan(loan)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loan Details Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedLoan(null)}
              className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500 font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-orange-600 mb-4">
              Loan Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
              <p>
                <strong>EPF Number:</strong> {selectedLoan.epfNumber}
              </p>
              <p>
                <strong>Name:</strong> {selectedLoan.name}
              </p>
              <p>
                <strong>NIC:</strong> {selectedLoan.NIC}
              </p>
              <p>
                <strong>Loan Amount:</strong> Rs. {selectedLoan.loanAmount}
              </p>
              <p>
                <strong>Role:</strong> {selectedLoan.role}
              </p>
              <p>
                <strong>Reason:</strong> {selectedLoan.reason}
              </p>
              <p>
                <strong>Loan Date:</strong>{" "}
                {new Date(selectedLoan.loanDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedLoan.status}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilteredLoanList;
