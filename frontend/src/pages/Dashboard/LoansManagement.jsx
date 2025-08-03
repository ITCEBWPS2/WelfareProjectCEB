import React, { useEffect, useState, createContext } from "react"; // Removed useContext
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import bgImage from '../../images/background.png';

import LoanApplication from '../Applications/LoanApplication'; 

const AuthContext = createContext(null);
const useAuth = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    setUser({ role: 'SuperAdmin', uid: 'mock-user-id' }); // Example: Set to SuperAdmin for testing
  }, []);
  return { user };
};

const toast = {
  success: (message) => console.log("Success:", message),
  error: (message) => console.error("Error:", message),
};

const isSuperAdmin = (user) => user?.role === 'SuperAdmin';
const isTreasurerOrAssistantTreasurer = (user) =>
  user?.role === 'Treasurer' || user?.role === 'AssistantTreasurer';

const SquarePen = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
const Trash2 = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;

// Dialog Components
const DialogContext = React.createContext();

const Dialog = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <DialogContext.Provider value={{ isOpen, openDialog, closeDialog }}>
      {React.Children.map(children, child => {
        if (child.type === DialogTrigger) {
          return React.cloneElement(child, { onClick: openDialog });
        }
        if (child.type === DialogContent) {
          return isOpen ? React.cloneElement(child, { onClose: closeDialog }) : null;
        }
        return child;
      })}
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children, onClick }) => (
  <span onClick={onClick} className="cursor-pointer">
    {children}
  </span>
);

const DialogContent = ({ children, onClose, className }) => (
  <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${className}`}>
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

const DialogHeader = ({ children, className }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

const DialogTitle = ({ children, className }) => (
  <h2 className={`text-xl font-semibold ${className}`}>
    {children}
  </h2>
);

const DialogDescription = ({ children, className }) => (
  <p className={`text-sm text-gray-600 ${className}`}>
    {children}
  </p>
);

// Popover Components
const PopoverContext = React.createContext();

const Popover = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const togglePopover = () => setIsOpen(!isOpen);
  const closePopover = () => setIsOpen(false);

  return (
    <PopoverContext.Provider value={{ isOpen, togglePopover, closePopover }}>
      {React.Children.map(children, child => {
        if (child.type === PopoverTrigger) {
          return React.cloneElement(child, { onClick: togglePopover });
        }
        if (child.type === PopoverContent) {
          return isOpen ? React.cloneElement(child, { onClose: closePopover }) : null;
        }
        return child;
      })}
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = ({ children, onClick }) => (
  <span onClick={onClick} className="cursor-pointer">
    {children}
  </span>
);

const PopoverContent = ({ children, onClose, className }) => (
  <div className={`absolute z-10 bg-white border border-gray-200 rounded-md shadow-lg p-4 mt-2 ${className}`}>
    {children}
  </div>
);

const BASE_URL = "http://localhost:5000"; // IMPORTANT: Replace with your actual backend URL

const LoansTable = ({ status: propStatus = "all", tableTitle }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loanStatus, setLoanStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [showLoanDetailsDialog, setShowLoanDetailsDialog] = useState(false);
  const [currentLoanDetails, setCurrentLoanDetails] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  const allowedStatuses = ["pending", "approved", "rejected"];

  // Memoize fetchLoans if it's not stable, but for this use case,
  // adding it to deps is fine and ESLint will be happy.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchLoans = React.useCallback(async () => { // Wrapped with useCallback for stability
    setLoading(true);
    try {
      let url = `${BASE_URL}/api/loans/util/loans-by-status`;

      if (propStatus && propStatus !== "all") {
        url += `?status=${propStatus}`;
      }
      const response = await axios.get(url, {
        withCredentials: true,
      });

      const approvedLoans = response.data.filter(loan => loan.loanStatus === "approved");
      const counts = {};
      approvedLoans.forEach((loan) => {
        counts[loan.epf] = (counts[loan.epf] || 0) + 1;
      });

      const loansWithCount = response.data.map((loan) => ({
        ...loan,
        loancount: loan.loanStatus === "approved" ? counts[loan.epf] : "-",
      }));

      setLoans(loansWithCount);
    } catch (error) {
      console.error("Error fetching loans:", error);
      toast.error("Failed to fetch loans.");
    } finally {
      setLoading(false);
    }
  }, [propStatus]); // fetchLoans depends on propStatus

  useEffect(() => {
    fetchLoans();
  }, [propStatus, fetchLoans]); // Added fetchLoans to dependency array

  const fetchMemberId = async (epf) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/members/find/${epf}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      toast.success(`Navigating to member details for EPF: ${response.data.epf}`);
      navigate(`/dashboard/members/${response.data.epf}`);
    } catch (error) {
      console.error("Error fetching member data:", error);
      toast.error("Error fetching member data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLoanId) return;

    try {
      const payload = { loanStatus };
      if (loanStatus === "rejected") {
        payload.rejectionReason = rejectionReason;
      }

      const response = await axios.put(
        `${BASE_URL}/api/loans/${selectedLoanId}/status`,
        payload,
        {
          withCredentials: true,
        }
      );

      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan._id === selectedLoanId ? { ...loan, loanStatus, rejectionReason: loanStatus === "rejected" ? rejectionReason : "" } : loan
        )
      );

      toast.success(response.data.message);
    } catch (error) {
      console.error("Error updating loan status:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSelectedLoanId(null);
      setRejectionReason("");
      setLoanStatus("");
    }
  };

  const handleDelete = async (loanId) => {
    if (window.confirm("Are you sure you want to delete this loan?")) {
      try {
        await axios.delete(`${BASE_URL}/api/loans/${loanId}`, {
          withCredentials: true,
        });
        setLoans(loans.filter((loan) => loan._id !== loanId));
        toast.success("Loan deleted successfully.");
      } catch (error) {
        console.error("Error deleting loan:", error);
        toast.error("Failed to delete loan!!!");
      }
    }
  };

  const handleViewDetails = (loan) => {
    setCurrentLoanDetails(loan);
    setShowLoanDetailsDialog(true);
  };

  return (
    <div className="font-sans antialiased">
      <div className="overflow-x-auto bg-white/70 rounded-lg shadow-lg p-4 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{tableTitle}</h2> {/* Dynamic title */}
        <table className="min-w-full bg-white/80 rounded-lg overflow-hidden">
          <thead className="bg-orange-600 text-white text-xs md:text-sm">
            <tr>
              {[
                "EPF No",
                "Loan Number",
                "Loan Amount",
                "Status",
                "Actions",
                "Loans Count",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loans.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  {loading ? "Loading loans..." : "No loans found."}
                </td>
              </tr>
            )}
            {loans.map((loan) => (
              <tr key={loan._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-100/70">
                <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                  {loan.epf}
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                  {loan.loanNumber}
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                  {loan.loanAmount}
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${loan.loanStatus === 'approved' ? 'bg-green-100 text-green-800' : ''}
                      ${loan.loanStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${loan.loanStatus === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {loan.loanStatus}
                    </span>
                    {isTreasurerOrAssistantTreasurer(user) && (
                      <Popover>
                        <PopoverTrigger>
                          <SquarePen
                            className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors duration-200"
                            size={18}
                            onClick={() => {
                              setSelectedLoanId(loan._id);
                              setLoanStatus(loan.loanStatus);
                              setRejectionReason(loan.rejectionReason || "");
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="shadow-md p-4">
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Status</label>
                              <select
                                value={loanStatus}
                                onChange={(e) => setLoanStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              >
                                <option value="">Select Status</option>
                                {allowedStatuses.map((statusOption) => (
                                  <option key={statusOption} value={statusOption}>
                                    {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {loanStatus === "rejected" && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                                <textarea
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  placeholder="Enter reason for rejection"
                                  rows={3}
                                  required
                                />
                              </div>
                            )}
                            <button
                              type="submit"
                              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                              Update Status
                            </button>
                          </form>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </td>

                <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                  <div className="flex space-x-2 items-center">
                    {isTreasurerOrAssistantTreasurer(user) && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white rounded-md p-1.5 flex items-center justify-center transition-colors duration-200"
                        onClick={() => handleViewDetails(loan)}
                      >
                        <SquarePen className="w-4 h-4" />
                      </button>
                    )}
                    {isSuperAdmin(user) && (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white rounded-md p-1.5 flex items-center justify-center transition-colors duration-200"
                        onClick={() => handleDelete(loan._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => fetchMemberId(loan.epf)}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200"
                    >
                      {loading ? "Loading..." : "View User"}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap text-center align-middle text-gray-800">
                  {loan.loancount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showLoanDetailsDialog && currentLoanDetails && (
        <Dialog>
          <DialogContent onClose={() => setShowLoanDetailsDialog(false)} className="max-w-xl">
            <DialogHeader className="border-b pb-4 mb-4">
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Loan Details: {currentLoanDetails.loanNumber}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Comprehensive details of the selected loan.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2 text-gray-700 space-y-3 text-sm grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              <p><strong>Member No:</strong> {currentLoanDetails.memberNumber || "N/A"}</p>
              <p><strong>EPF No:</strong> {currentLoanDetails.epf || "N/A"}</p>
              <p><strong>Loan No:</strong> {currentLoanDetails.loanNumber || "N/A"}</p>
              <p><strong>Loan Amount:</strong> {currentLoanDetails.loanAmount || "N/A"}</p>
              <p><strong>Member Name:</strong> {currentLoanDetails.name || "N/A"}</p>
              <p><strong>Address:</strong> {currentLoanDetails.address || "N/A"}</p>
              <p><strong>Position:</strong> {currentLoanDetails.position || "N/A"}</p>
              <p><strong>Branch:</strong> {currentLoanDetails.branch || "N/A"}</p>
              <p><strong>Contact Number:</strong> {currentLoanDetails.contactNo?.mobile || "N/A"}</p>
              <p><strong>WhatsApp Number:</strong> {currentLoanDetails.contactNo?.landline || "N/A"}</p>
              <p><strong>NIC:</strong> {currentLoanDetails.nationalIdNumber || "N/A"}</p>
              <p><strong>Reason for Loan:</strong> {currentLoanDetails.reasonForLoan || "N/A"}</p>
              <p><strong>Required Loan Date:</strong> {currentLoanDetails.requiredLoanDate ? new Date(currentLoanDetails.requiredLoanDate).toLocaleDateString("en-GB") : "N/A"}</p>
              <p><strong>Date of Birth:</strong> {currentLoanDetails.dateOfBirth ? new Date(currentLoanDetails.dateOfBirth).toLocaleDateString("en-GB") : "N/A"}</p>
              <p><strong>Retirement Date:</strong> {currentLoanDetails.retirementDate ? new Date(currentLoanDetails.retirementDate).toLocaleDateString("en-GB") : "N/A"}</p>
              <p><strong>Loan Status:</strong> {currentLoanDetails.loanStatus || "N/A"}</p>
              {currentLoanDetails.rejectionReason && (
                <p className="col-span-2"><strong>Rejection Reason:</strong> {currentLoanDetails.rejectionReason}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};


const LoanDashboard = () => { // Renamed from LoanManagement to match your file name context
  const navigate = useNavigate();
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [tableTitle, setTableTitle] = useState("All Loans");

  // New state to control the visibility of the LoanApplication modal
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);

  useEffect(() => {
    if (activeStatusFilter === "all") {
      setTableTitle("All Loans");
    } else {
      setTableTitle(`${activeStatusFilter.charAt(0).toUpperCase() + activeStatusFilter.slice(1)} Loans`);
    }
  }, [activeStatusFilter]);


  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate('/');
    }
  };

  // Modified handleAddNewLoan to open the modal
  const handleAddNewLoan = () => {
    setShowNewLoanModal(true);
  };

  // Function to close the LoanApplication modal
  const handleCloseNewLoanModal = () => {
    setShowNewLoanModal(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-white/90 to-white/60 border-r shadow-sm p-4 flex flex-col justify-between">
        <div>
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-800 leading-tight pb-10">
              CEB WELFARE <br /> WPS II
            </h1>
          </div>
          <nav>
            <h2 className="text-xl text-gray-700 font-bold uppercase mb-2">Dashboard</h2>
            <ul className="mb-4 space-y-2">
              <li>
                <button className="w-full text-left px-7 py-2 rounded-md text-gray-700 bg-orange-200 transition text-lg">
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/auditLog')}
                  className="w-full text-left px-7 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition text-lg"
                >
                  Audit Logs
                </button>
              </li>
            </ul>
            <h2 className="text-xl text-gray-700 font-bold uppercase mb-2">Admin Options</h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/manageAdmins')}
                  className="w-full text-left px-7 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition text-lg"
                >
                  Manage Admins
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/manageEmployees')}
                  className="w-full text-left px-7 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition text-lg"
                >
                  Manage Employees
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="pt-6 pb-5">
          <button
            onClick={handleLogout}
            className="w-full text-left px-7 py-2 rounded-md bg-green-500 text-black hover:bg-green-600 transition text-xl text-center font-bold"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-y-auto"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 p-6 min-h-screen">
          <h1 className="text-3xl font-bold text-white mb-6 drop-shadow">
            Loan Management
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-center mt-20 mb-6 space-y-4 md:space-y-0 md:space-x-4 max-w-7xl mx-auto">
            <button
              onClick={handleAddNewLoan} // This button now sets showNewLoanModal to true
              className="px-6 py-2 rounded-full text-m font-medium transition-all duration-300
                         bg-green-600 text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full md:w-auto"
            >
              + New Loan
            </button>

            {/* Filter Buttons */}
            <div className="flex justify-center space-x-4 w-full md:w-auto">
              {["all", "pending", "approved", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatusFilter(status)}
                  className={`px-6 py-2 rounded-full text-m font-medium transition-all duration-300
                    ${activeStatusFilter === status
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} Loans
                </button>
              ))}
            </div>
          </div>

          {/* Loan Table */}
          <LoansTable status={activeStatusFilter} tableTitle={tableTitle} />

          {/* Conditionally render the LoanApplication modal */}
          {showNewLoanModal && <LoanApplication onClose={handleCloseNewLoanModal} />}
        </div>
      </main>
    </div>
  );
};

export default LoanDashboard;