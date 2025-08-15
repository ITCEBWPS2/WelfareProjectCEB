import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:8070/api/v1/deathfunds";

const FilteredDeathFundList = ({ statusFilter }) => {
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);

  useEffect(() => {
    fetchFunds();
  }, [statusFilter]);

  const fetchFunds = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/viewDeathFunds`);
      const filtered = statusFilter
        ? res.data.filter((fund) => fund.status === statusFilter)
        : res.data;
      setFunds(filtered);
    } catch (err) {
      console.error("Error fetching death fund records:", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
  const result = await Swal.fire({
    title: `Are you sure?`,
    text: `You want to ${newStatus} this fund.`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: `Yes, ${newStatus}`,
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      await axios.put(`${BASE_URL}/updateStatus/${id}`, { status: newStatus });
      Swal.fire("Success", `Fund ${newStatus} successfully`, "success");
      fetchFunds();
    } catch (err) {
      Swal.fire("Error", "Status update failed", "error");
    }
  }
};


  const deleteFund = async (id) => {
    const result = await Swal.fire({
      title: "Delete Record?",
      text: "This action is permanent!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/deleteDeathFund/${id}`);
        Swal.fire("Deleted!", "Record has been deleted.", "success");
        setSelectedFund(null);
        fetchFunds();
      } catch (err) {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-orange-500 text-white text-left">
              <th className="p-3">#</th>
              <th className="p-3">EPF Number</th>
              <th className="p-3">Beneficiary Name</th>
              <th className="p-3">Fund Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((fund, index) => (
              <tr
                key={fund._id}
                className="border-b hover:bg-orange-50 transition"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{fund.epfNumber}</td>
                <td className="p-3">{fund.beneficiaryName}</td>
                <td className="p-3">Rs. {fund.fundAmount}</td>
                <td className="p-3">
                  <span
                    className={`font-semibold ${
                      fund.status === "approved"
                        ? "text-green-600"
                        : fund.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {fund.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  {fund.status === "pending" ? (
                    <>
                      <button
                        onClick={() => updateStatus(fund._id, "approved")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(fund._id, "rejected")}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Reject
                      </button>
                    </>
                  ) : null}
                  <button
                    onClick={() => deleteFund(fund._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedFund(fund)}
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

      {selectedFund && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedFund(null)}
              className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500 font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-orange-600 mb-4">
              Death Fund Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
              <p>
                <strong>EPF Number:</strong> {selectedFund.epfNumber}
              </p>
              <p>
                <strong>Beneficiary Name:</strong> {selectedFund.beneficiaryName}
              </p>
              <p>
                <strong>Contact Number:</strong> {selectedFund.contactNumber}
              </p>
              <p>
                <strong>Date of Death:</strong>{" "}
                {new Date(selectedFund.dateOfDeath).toLocaleDateString()}
              </p>
              <p>
                <strong>Beneficiary Type:</strong> {selectedFund.beneficiaryType}
              </p>
              <p>
                <strong>Fund Amount:</strong> Rs. {selectedFund.fundAmount}
              </p>
              <p>
                <strong>Fund Date:</strong>{" "}
                {new Date(selectedFund.fundDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Fund Type:</strong> {selectedFund.fundType}
              </p>
              <p>
                <strong>Payment Method:</strong> {selectedFund.paymentMethod}
              </p>
              <p>
                <strong>Status:</strong> {selectedFund.status}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilteredDeathFundList;
