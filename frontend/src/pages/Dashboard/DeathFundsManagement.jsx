import React, { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import bgImage from '../../images/background.png';

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

const BASE_URL = "http://localhost:5000"; // IMPORTANT: Replace with your actual backend URL

const DeathFundsTable = ({ tableTitle }) => {
    const [deathFunds, setDeathFunds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDeathFundDetailsDialog, setShowDeathFundDetailsDialog] = useState(false);
    const [currentDeathFundDetails, setCurrentDeathFundDetails] = useState(null);

    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchDeathFunds();
    }, []);

    const fetchDeathFunds = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/deathfunds`, {
                withCredentials: true,
            });
            // Assuming your backend returns an array of death fund objects like:
            // [{ _id: "1", epfNumber: "12121", person: "member", amount: 2500, date: "2024-12-30" }]
            setDeathFunds(response.data);
        } catch (error) {
            console.error("Error fetching death funds:", error);
            toast.error("Failed to fetch death funds.");
        } finally {
            setLoading(false);
        }
    };

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

    const handleDelete = async (deathFundId) => {
        if (window.confirm("Are you sure you want to delete this death fund entry?")) {
            try {
                await axios.delete(`${BASE_URL}/api/deathfunds/${deathFundId}`, {
                    withCredentials: true,
                });
                setDeathFunds(deathFunds.filter((fund) => fund._id !== deathFundId));
                toast.success("Death fund entry deleted successfully.");
            } catch (error) {
                console.error("Error deleting death fund entry:", error);
                toast.error("Failed to delete death fund entry!!!");
            }
        }
    };

    const handleViewDetails = (deathFund) => {
        setCurrentDeathFundDetails(deathFund);
        setShowDeathFundDetailsDialog(true);
    };

    return (
        <div className="font-sans antialiased">
            <div className="overflow-x-auto bg-white/70 rounded-lg shadow-lg p-4 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{tableTitle}</h2>
                <table className="min-w-full bg-white/80 rounded-lg overflow-hidden">
                    <thead className="bg-orange-600 text-white text-xs md:text-sm">
                        <tr>
                            {[
                                "EPF Number",
                                "Person",
                                "Amount",
                                "Date",
                                "Actions",
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
                        {deathFunds.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                    {loading ? "Loading death funds..." : "No death funds found."}
                                </td>
                            </tr>
                        ) : (
                            deathFunds.map((fund) => (
                                <tr key={fund._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-100/70">
                                    <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                                        {fund.epfNumber}
                                    </td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                                        {fund.person}
                                    </td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                                        {fund.amount}
                                    </td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                                        {fund.date ? new Date(fund.date).toLocaleDateString("en-GB") : "N/A"}
                                    </td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                                        <div className="flex space-x-2 items-center">
                                            {/* Edit/View Details for Death Fund Entry */}
                                            {isTreasurerOrAssistantTreasurer(user) && (
                                                <button
                                                    className="bg-green-500 hover:bg-green-600 text-white rounded-md p-1.5 flex items-center justify-center transition-colors duration-200"
                                                    onClick={() => handleViewDetails(fund)}
                                                >
                                                    <SquarePen className="w-4 h-4" />
                                                </button>
                                            )}
                                            {/* Delete Death Fund Entry */}
                                            {isSuperAdmin(user) && (
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white rounded-md p-1.5 flex items-center justify-center transition-colors duration-200"
                                                    onClick={() => handleDelete(fund._id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            {/* View User (Member) Details */}
                                            <button
                                                onClick={() => fetchMemberId(fund.epfNumber)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-200"
                                            >
                                                View User
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showDeathFundDetailsDialog && currentDeathFundDetails && (
                <Dialog>
                    <DialogContent onClose={() => setShowDeathFundDetailsDialog(false)} className="max-w-xl">
                        <DialogHeader className="border-b pb-4 mb-4">
                            <DialogTitle className="text-2xl font-bold text-gray-800">
                                Death Fund Details
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                Details of the selected death fund entry.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-2 text-gray-700 space-y-3 text-sm grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                            <p><strong>EPF Number:</strong> {currentDeathFundDetails.epfNumber || "N/A"}</p>
                            <p><strong>Person:</strong> {currentDeathFundDetails.person || "N/A"}</p>
                            <p><strong>Amount:</strong> {currentDeathFundDetails.amount || "N/A"}</p>
                            <p><strong>Date:</strong> {currentDeathFundDetails.date ? new Date(currentDeathFundDetails.date).toLocaleDateString("en-GB") : "N/A"}</p>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};


const DeathFundsDashboard = () => {
    const navigate = useNavigate();
    const [tableTitle, setTableTitle] = useState("Death Funds");

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            navigate('/');
        }
    };

    const handleNewDeathFund = () => {
        navigate("/dashboard/deathfunds/add"); // Navigate to a form for adding new death funds
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar - Kept as is */}
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
                        Death Funds Management
                    </h1>

                    <div className="flex flex-col md:flex-row justify-between items-center mt-20 mb-6 space-y-4 md:space-y-0 md:space-x-4 max-w-7xl mx-auto">
                        <button
                            onClick={handleNewDeathFund}
                            className="px-6 py-2 rounded-full text-m font-medium transition-all duration-300
                                       bg-green-600 text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-full md:w-auto"
                        >
                            + Death Fund
                        </button>
                    </div>

                    {/* Death Fund Table */}
                    <DeathFundsTable tableTitle={tableTitle} />
                </div>
            </main>
        </div>
    );
};

export default DeathFundsDashboard;