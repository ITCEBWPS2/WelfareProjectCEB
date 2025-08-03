import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import axios from 'axios';
import SideBar from '../SideBar';
import bgImage from '../../../images/background.png';

const BASE_URL = "http://localhost:8070/api/v1/loans";

const ViewLoans = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/viewLoans`);
      setLoans(res.data);
    } catch (err) {
      console.error("Error fetching loans:", err);
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
          <h2 className="text-3xl font-bold text-white drop-shadow mb-6">View Loans</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {loans.map((loan) => (
              <div
                key={loan._id}
                className="bg-white/90 border-l-4 border-orange-500 rounded-xl shadow-lg p-5 hover:bg-orange-50 transition cursor-pointer"
                onClick={() => setSelectedLoan(loan)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Loan #{loan.loanNumber || loan._id.slice(-4)}</h3>
                    <p className="text-sm text-gray-600">EPF: {loan.epfNumber}</p>
                    <p className="text-sm text-gray-600">Name: {loan.name}</p>
                    <p className="text-sm text-gray-600">Amount: Rs. {loan.loanAmount}</p>
                    <p className="text-sm text-gray-600">Status: {loan.loanStatus}</p>
                  </div>
                  <Eye className="text-orange-600" />
                </div>
              </div>
            ))}
          </div>

          {/* Loan Details Dialog */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <p><strong>EPF Number:</strong> {selectedLoan.epfNumber}</p>
                  <p><strong>Name:</strong> {selectedLoan.name}</p>
                  <p><strong>NIC:</strong> {selectedLoan.NIC}</p>
                  <p><strong>Loan Amount:</strong> Rs. {selectedLoan.loanAmount}</p>
                  <p><strong>Role:</strong> {selectedLoan.roll}</p>
                  <p><strong>Reason:</strong> {selectedLoan.reason}</p>
                  <p><strong>Loan Date:</strong> {new Date(selectedLoan.loanDate).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {selectedLoan.loanStatus || "Pending"}</p>
                  {selectedLoan.rejectionReason && (
                    <p className="md:col-span-2">
                      <strong>Rejection Reason:</strong> {selectedLoan.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewLoans;
