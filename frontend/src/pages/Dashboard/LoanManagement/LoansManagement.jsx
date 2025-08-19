import React, { useState } from 'react';
import bgImage from '../../../images/background.png';
import { Plus, FileText, ThumbsUp, Clock, Ban } from 'lucide-react';
import SideBar from "../SideBar";
import BackButton from "../../Dashboard/BackButton";
import { useEffect } from "react";

// Import your loan components
import CreateLoan from './CreateLoan';
import ViewLoans from './ViewAllLoans';
import PendingLoans from './ViewPendingLoans';
import ApprovedLoans from './ViewApprovedLoans';
import RejectedLoans from './ViewRejectedLoans';






const LoanDashboard = () => {
  const [activeTab, setActiveTab] = useState("new");

  const tabs = [
    { id: "new", label: "New Loan", icon: <Plus size={20} /> },
    { id: "view", label: "View All Loans", icon: <FileText size={20} /> },
    { id: "pending", label: "Pending Loans", icon: <Clock size={20} /> },
    { id: "approved", label: "Approved Loans", icon: <ThumbsUp size={20} /> },
    { id: "rejected", label: "Rejected Loans", icon: <Ban size={20} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "new": return <CreateLoan />;
      case "view": return <ViewLoans />;
      case "pending": return <PendingLoans />;
      case "approved": return <ApprovedLoans />;
      case "rejected": return <RejectedLoans />;
      default: return null;
    }
  };

  useEffect(() => {
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = "auto"; // restore on unmount
  };
}, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main
        className="flex-1 relative bg-cover bg-center bg-no-repeat bg-fixed overflow-y-auto"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 p-6">
          <h2 className="text-3xl font-bold text-white drop-shadow mb-4">Loan Management</h2>
          

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <BackButton to="/dashboard" />
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-white"
                    : "bg-white/90 hover:bg-orange-100 text-gray-800"
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
            
          </div>

          {/* Tab Content */}
          <div>
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoanDashboard;
