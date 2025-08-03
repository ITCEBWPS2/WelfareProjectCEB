import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, FileText, ThumbsUp, Clock, Ban } from 'lucide-react';
import bgImage from '../../../images/background.png';
import SideBar from "../SideBar";

const LoanDashboard = () => {
  const navigate = useNavigate();

  const loanActions = [
    { title: 'New Loan', icon: <Plus size={24} className="text-amber-500" />, path: '/createLoan' },
    { title: 'View All Loans', icon: <FileText size={24} className="text-amber-500" />, path: '/viewLoans' },
    { title: 'Pending Loans', icon: <Clock size={24} className="text-amber-500" />, path: '/viewLoans/pending' },
    { title: 'Approved Loans', icon: <ThumbsUp size={24} className="text-amber-500" />, path: '/viewLoans/approved' },
    { title: 'Rejected Loans', icon: <Ban size={24} className="text-amber-500" />, path: '/viewLoans/rejected' },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate('/');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main
        className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-y-auto"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 p-6">
          {/* Title */}
          <h2 className="text-3xl font-bold text-white drop-shadow mb-6">Loan Management</h2>

          {/* Loan Action Buttons */}
          <div className="p-6 min-h-[calc(100vh-150px)] flex items-center justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl">
              {loanActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="bg-white/90 shadow-md rounded-2xl p-8 text-xl font-semibold hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer hover:bg-orange-100 flex items-center justify-center space-x-3 border-t-4 border-amber-500"
                >
                  {action.icon}
                  <span>{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Back Link */}
        <Link to="/dashboard" className="absolute bottom-4 right-6 text-white text-sm cursor-pointer hover:underline">Back</Link>
      </main>
    </div>
  );
};

export default LoanDashboard;
