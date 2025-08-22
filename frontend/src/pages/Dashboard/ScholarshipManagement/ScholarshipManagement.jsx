import React, { useState, useEffect } from "react";
import bgImage from "../../../images/background.png";
import { Plus, FileText, ThumbsUp, Clock, Ban } from "lucide-react";
import SideBar from "../SideBar";
import BackButton from "../BackButton";

// Import your Scholarship components
import CreateScholarship from "./CreateScholarship";
import ViewScholarships from "./ViewAllScholarships";
import PendingScholarships from "./PendingScholarships";
import ApprovedScholarships from "./ApprovedScholarships";
import RejectedScholarships from "./RejectedScholarships";

const ManageScholarships = () => {
  const [activeTab, setActiveTab] = useState("new");

  const tabs = [
    { id: "new", label: "New Scholarship", icon: <Plus size={20} /> },
    { id: "view", label: "View All Scholarships", icon: <FileText size={20} /> },
    { id: "pending", label: "Pending Scholarships", icon: <Clock size={20} /> },
    { id: "approved", label: "Approved Scholarships", icon: <ThumbsUp size={20} /> },
    { id: "rejected", label: "Rejected Scholarships", icon: <Ban size={20} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "new":
        return <CreateScholarship />;
      case "view":
        return <ViewScholarships />;
      case "pending":
        return <PendingScholarships />;
      case "approved":
        return <ApprovedScholarships />;
      case "rejected":
        return <RejectedScholarships />;
      default:
        return null;
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
        className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-y-auto"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 z-0" />

        <div className="relative z-10 p-6">
          <h2 className="text-3xl font-bold text-white drop-shadow mb-4">
            Scholarship Management
          </h2>

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
          <div>{renderTabContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default ManageScholarships;
