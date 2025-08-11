// components/loan/FilteredLoanList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye } from 'lucide-react';
import SideBar from '../SideBar';
import bgImage from '../../../images/background.png';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const BASE_URL = "http://localhost:8070/api/v1/loans";

const FilteredLoanList = ({ title, statusFilter }) => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/viewLoans`);
      const filtered = statusFilter ? res.data.filter(l => l.status === statusFilter) : res.data;
      setLoans(filtered);
    } catch (err) {
      console.error("Error fetching loans:", err);
    }
  };

  const updateStatus = async (id, status) => {
    const result = await Swal.fire({
      title: `Confirm ${status}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${BASE_URL}/updateStatus/${id}`, { status });
        Swal.fire('Success', `Loan ${status} successfully`, 'success');
        setSelectedLoan(null);
        fetchLoans();
      } catch (err) {
        Swal.fire('Error', 'Failed to update loan status', 'error');
      }
    }
  };

  const deleteLoan = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Loan?',
      text: 'This action is permanent!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/deleteLoan/${id}`);
        Swal.fire('Deleted!', 'Loan has been deleted.', 'success');
        setSelectedLoan(null);
        fetchLoans();
      } catch (err) {
        Swal.fire('Error', 'Delete failed', 'error');
      }
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
          <h2 className="text-3xl font-bold text-white drop-shadow mb-6">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {loans.map((loan) => (
              <div
                key={loan._id}
                className="bg-white/90 border-l-4 border-orange-500 rounded-xl shadow-lg p-5 hover:bg-orange-50 transition cursor-pointer"
                onClick={() => setSelectedLoan(loan)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Loan #{loan.loanID || loan._id.slice(-4)}
                    </h3>
                    <p className="text-sm text-gray-600">EPF: {loan.epfNumber}</p>
                    <p className="text-sm text-gray-600">Name: {loan.name}</p>
                    <p className="text-sm text-gray-600">Amount: Rs. {loan.loanAmount}</p>
                    <p className="text-sm text-gray-600">Status:{" "}
                        <span
                            className={`font-semibold ${
                            loan.status === "approved"
                                ? "text-green-600"
                                : loan.status === "rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}>{loan.status}
                        </span>
                    </p>
                  </div>
                  <Eye className="text-orange-600" />
                </div>
              </div>
            ))}
          </div>

          {selectedLoan && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative">
                <button
                  onClick={() => setSelectedLoan(null)}
                  className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500 font-bold"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-semibold text-orange-600 mb-4">Loan Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                  <p><strong>EPF Number:</strong> {selectedLoan.epfNumber}</p>
                  <p><strong>Name:</strong> {selectedLoan.name}</p>
                  <p><strong>NIC:</strong> {selectedLoan.NIC}</p>
                  <p><strong>Loan Amount:</strong> Rs. {selectedLoan.loanAmount}</p>
                  <p><strong>Role:</strong> {selectedLoan.role}</p>
                  <p><strong>Reason:</strong> {selectedLoan.reason}</p>
                  <p><strong>Loan Date:</strong> {new Date(selectedLoan.loanDate).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {selectedLoan.status}</p>
                </div>

                <div className="flex justify-end space-x-3">
                  {selectedLoan.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(selectedLoan._id, 'approved')}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(selectedLoan._id, 'rejected')}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteLoan(selectedLoan._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <Link to="/loansManagement" className="absolute bottom-4 right-6 text-white text-sm cursor-pointer hover:underline">Back</Link>
      </main>
    </div>
  );
};

export default FilteredLoanList;
