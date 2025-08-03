import React, { useEffect, useState, useCallback, createContext } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import bgImage from '../../images/background.png';

// Import DeathFundForm
import DeathFundForm from '../Applications/DeathFundApplication'; 

// --- Mocking Contexts, Icons, and Toast (as provided in your LoanDashboard) ---
// In a real application, you would import these from their respective files.
const AuthContext = createContext(null);
const useAuth = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // For demonstration, setting a user role. Adjust as per your actual auth context.
    setUser({ role: 'SuperAdmin', uid: 'mock-user-id' });
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

// --- Dialog Components (copied directly from your LoanDashboard for consistency) ---
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

// --- Popover Components (copied directly from your LoanDashboard for consistency) ---
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

// Basic DeathFundsTable component - simplified to just display data
const DeathFundsTable = ({ tableTitle }) => {
  const [deathFunds, setDeathFunds] = useState([]);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchDeathFunds = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/deathfunds`, {
        withCredentials: true,
      });
      setDeathFunds(response.data);
    } catch (error) {
      console.error("Error fetching death funds:", error);
      toast.error("Failed to fetch death fund entries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeathFunds();
  }, [fetchDeathFunds]); // Added fetchDeathFunds to dependency array

  // No edit/delete/view details functions here, as per requirements (only navigation for "View User")
  // The "Actions" column will only contain "View User" if needed.
  const navigate = useNavigate();
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

  return (
    <div className="font-sans antialiased">
      <div className="overflow-x-auto bg-white/70 rounded-lg shadow-lg p-4 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{tableTitle}</h2>
        <table className="min-w-full bg-white/80 rounded-lg overflow-hidden">
          <thead className="bg-orange-600 text-white text-xs md:text-sm">
            <tr>
              {[
                "EPF No",
                "Person Type",
                "Amount",
                "Date",
                "Actions", // Still include for "View User" if needed
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
            {deathFunds.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  {loading ? "Loading death fund entries..." : "No death fund entries found."}
                </td>
              </tr>
            )}
            {deathFunds.map((entry) => (
              <tr key={entry._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-100/70">
                <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                  {entry.epf}
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                  {entry.personType}
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                  {entry.amount}
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                  {new Date(entry.date).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                  <button
                    onClick={() => fetchMemberId(entry.epf)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200"
                  >
                    {loading ? "Loading..." : "View User"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DeathFundsManagement = () => { // Renamed from LoanDashboard for clarity
  const navigate = useNavigate();
  const [showNewDeathFundModal, setShowNewDeathFundModal] = useState(false);
  const [tableTitle, setTableTitle] = useState("All Death Fund Entries");

  useEffect(() => {
    // This effect is mainly to set the initial table title
    setTableTitle("All Death Fund Entries");
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate('/');
    }
  };

  // Function to open the DeathFundForm modal
  const handleAddNewDeathFund = () => {
    setShowNewDeathFundModal(true);
  };

  // Function to close the DeathFundForm modal
  const handleCloseNewDeathFundModal = () => {
    setShowNewDeathFundModal(false);
    // You might want to re-fetch data for the table after the modal closes
    // If DeathFundsTable had a prop to trigger re-fetch, you'd call it here.
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
                  Dashboard {/* Existing text and color */}
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
            Death Funds Management
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-center mt-20 mb-6 space-y-4 md:space-y-0 md:space-x-4 max-w-7xl mx-auto">
            {/* The button that triggers the DeathFundForm modal */}
            <button
              onClick={handleAddNewDeathFund}
              className="px-6 py-2 rounded-full text-m font-medium transition-all duration-300
                         bg-green-600 text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full md:w-auto"
            >
              + Death Fund
            </button>

            {/* Removed the filter buttons as requested */}
          </div>

          {/* Death Funds Table */}
          <DeathFundsTable tableTitle={tableTitle} />

          {/* Conditionally render the DeathFundForm modal */}
          {showNewDeathFundModal && <DeathFundForm onClose={handleCloseNewDeathFundModal} />}
        </div>
      </main>
    </div>
  );
};

export default DeathFundsManagement;