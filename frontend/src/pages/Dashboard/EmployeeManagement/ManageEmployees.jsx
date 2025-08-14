import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserCog, Briefcase } from 'lucide-react';
import bgImage from '../../../images/background.png';
import SideBar from "../../Dashboard/SideBar";
import CreateEmployee from './CreateEmployee';
import ViewEmployees from './ViewEmployee';
import UpdateEmployee from './UpdateEmployee';
import ViewRetiredEmployees from './ViewRetiredEmployees';
import { useLocation } from 'react-router-dom';

const ManageEmployees = () => {
  const location = useLocation();
  // Map the state.section to the corresponding tab id
  const sectionToTabId = {
    newEmployee: "new",
    viewEmployees: "view",
    updateEmployees: "update",
    retiredEmployees: "retired",
  };
  
  const [activeTab, setActiveTab] = useState("new");

  useEffect(() => {
    const section = location.state?.section;
    if (section && sectionToTabId[section]) {
      setActiveTab(sectionToTabId[section]);
    }
  }, [location.state]);

  const tabs = [
    { id: "new", label: "New Employee", icon: <UserPlus size={20} /> },
    { id: "view", label: "View Employees", icon: <Users size={20} /> },
    { id: "update", label: "Update Employees", icon: <UserCog size={20} /> },
    { id: "retired", label: "Retired Employees", icon: <Briefcase size={20} /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "new":
        return <CreateEmployee />;
      case "view":
        return <ViewEmployees />;
      case "update":
        return <UpdateEmployee />;
      case "retired":
        return <ViewRetiredEmployees />;
      default:
        return null;
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
          <h2 className="text-3xl font-bold text-white drop-shadow mb-4">
            Manage Employees
          </h2>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-orange-600 text-white"
                    : "bg-white/80 hover:bg-orange-100 text-gray-800"
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

export default ManageEmployees;
