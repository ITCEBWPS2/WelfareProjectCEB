import React, { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import bgImage from '../../images/background.png';
import MedicalForm from '../Applications/MedicalApplication'; 

const AuthContext = createContext(null);
const useAuth = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
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

const MedicalsTable = ({ tableTitle }) => { // Renamed from RefundsTable
    const [medicals, setMedicals] = useState([]); // Renamed from refunds
    const [loading, setLoading] = useState(false);
    const [showMedicalDetailsDialog, setShowMedicalDetailsDialog] = useState(false); // Renamed
    const [currentMedicalDetails, setCurrentMedicalDetails] = useState(null); // Renamed

    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchMedicals(); 
    }, []);

    const fetchMedicals = async () => { 
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/medicals`, { 
                withCredentials: true,
            });

            setMedicals(response.data); 
        } catch (error) {
            console.error("Error fetching medicals:", error);
            toast.error("Failed to fetch medicals."); 
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

    const handleDelete = async (medicalId) => { 
        if (window.confirm("Are you sure you want to delete this medical entry?")) { 
            try {
                await axios.delete(`${BASE_URL}/api/medicals/${medicalId}`, { // Changed API endpoint
                    withCredentials: true,
                });
                setMedicals(medicals.filter((medical) => medical._id !== medicalId)); 
                toast.success("Medical entry deleted successfully."); 
            } catch (error) {
                console.error("Error deleting medical entry:", error); 
                toast.error("Failed to delete medical entry!!!"); 
            }
        }
    };

    const handleViewDetails = (medical) => { 
        setCurrentMedicalDetails(medical); 
        setShowMedicalDetailsDialog(true); 
    };

    return (
        <div className="font-sans antialiased">
            <div className="overflow-x-auto bg-white/90 rounded-lg shadow-lg p-4 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{tableTitle}</h2>
                <table className="min-w-full bg-white/90 rounded-lg overflow-hidden">
                    <thead className="bg-orange-600 text-white text-xs md:text-sm">
                        <tr>
                            {[
                                "EPF Number",
                                "Date", 
                                "Reason",
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
                        {medicals.length === 0 ? ( 
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-500">
                                    {loading ? "Loading medicals..." : "No medicals found."} 
                                </td>
                            </tr>
                        ) : (
                            medicals.map((medical) => ( 
                                <tr key={medical._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-100/70">
                                    <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                                        {medical.epfNumber}
                                    </td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                                        {medical.date ? new Date(medical.date).toLocaleDateString("en-GB") : "N/A"}
                                    </td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                                        {medical.reason || "N/A"}
                                    </td>
                                    <td className="px-4 py-2 text-sm whitespace-nowrap text-gray-800">
                                        <div className="flex space-x-2 items-center">
                                            {isTreasurerOrAssistantTreasurer(user) && (
                                                <button
                                                    className="bg-green-500 hover:bg-green-600 text-white rounded-md p-1.5 flex items-center justify-center transition-colors duration-200"
                                                    onClick={() => handleViewDetails(medical)}
                                                >
                                                    <SquarePen className="w-4 h-4" />
                                                </button>
                                            )}
                                            {isSuperAdmin(user) && (
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white rounded-md p-1.5 flex items-center justify-center transition-colors duration-200"
                                                    onClick={() => handleDelete(medical._id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => fetchMemberId(medical.epfNumber)}
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

            {showMedicalDetailsDialog && currentMedicalDetails && ( // Renamed
                <Dialog>
                    <DialogContent onClose={() => setShowMedicalDetailsDialog(false)} className="max-w-xl"> {/* Renamed */}
                        <DialogHeader className="border-b pb-4 mb-4">
                            <DialogTitle className="text-2xl font-bold text-gray-800">
                                Medical Details {/* Changed title */}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                Details of the selected medical entry. {/* Changed description */}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-2 text-gray-700 space-y-3 text-sm grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                            <p><strong>EPF Number:</strong> {currentMedicalDetails.epfNumber || "N/A"}</p>
                            <p><strong>Date:</strong> {currentMedicalDetails.date ? new Date(currentMedicalDetails.date).toLocaleDateString("en-GB") : "N/A"}</p> 
                            <p><strong>Reason:</strong> {currentMedicalDetails.reason || "N/A"}</p>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};


const MedicalsDashboard = () => { // Renamed component
    const navigate = useNavigate();
    const [tableTitle, setTableTitle] = useState("Medicals"); 
    const [showMedicalForm, setShowMedicalForm] = useState(false); // New state to control MedicalForm visibility

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            navigate('/');
        }
    };

    const handleNewMedical = () => { 
        setShowMedicalForm(true); // Open the MedicalForm modal
    };

    const handleCloseMedicalForm = () => {
        setShowMedicalForm(false); // Close the MedicalForm modal
        // Optionally, you might want to re-fetch medicals here to update the table
        // after a new medical claim is submitted.
        // fetchMedicals(); // You'd need to pass fetchMedicals down or lift it up.
    };

    return (
        <div className="flex h-screen">
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
                        Medicals Management 
                    </h1>

                    <div className="flex flex-col md:flex-row justify-between items-center mt-20 mb-6 space-y-4 md:space-y-0 md:space-x-4 max-w-7xl mx-auto">
                        <button
                            onClick={handleNewMedical}
                            className="px-6 py-2 rounded-full text-m font-medium transition-all duration-300
                                            bg-green-600 text-white shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full md:w-auto" 
                        >
                            + New Medical
                        </button>
                    </div>

                    {/* Medicals Table */}
                    <MedicalsTable tableTitle={tableTitle} /> {/* Changed component name */}
                </div>
            </main>

            {/* Render MedicalForm component as a modal */}
            {showMedicalForm && <MedicalForm onClose={handleCloseMedicalForm} />}
        </div>
    );
};

export default MedicalsDashboard;