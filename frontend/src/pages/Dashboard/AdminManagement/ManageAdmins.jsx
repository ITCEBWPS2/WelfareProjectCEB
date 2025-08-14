import React, { useState } from 'react';
import bgImage from '../../../images/background.png';
import { UserPlus, Users, KeyRound, UserX } from 'lucide-react';
import SideBar from "../SideBar";
import CreateAdmin from './CreateAdmin';
import ViewAdmin from './ViewAdmin';
import UpdateAdmin from './UpdateAdmin';
import DeleteAdmin from './DeleteAdmin';

const ManageAdmins = () => {
  const [activeTab, setActiveTab] = useState("new");

  const tabs = [
    { id: "new", label: "New Admin", icon: <UserPlus size={20} /> },
    { id: "view", label: "View Admins", icon: <Users size={20} /> },
    { id: "update", label: "Update Admins", icon: <KeyRound size={20} /> },
    { id: "delete", label: "Delete Admins", icon: <UserX size={20} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "new": return <CreateAdmin />;
      case "view": return <ViewAdmin />;
      case "update": return <UpdateAdmin />;
      case "delete": return <DeleteAdmin />;
      default: return null;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main
        className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-y-auto"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 p-6">
          <h2 className="text-3xl font-bold text-white drop-shadow mb-4">Manage Admins</h2>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-white"
                    : "bg-white/80 hover:bg-orange-100 text-gray-800"
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

export default ManageAdmins;
