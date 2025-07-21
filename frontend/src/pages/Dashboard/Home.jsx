import React from 'react';
import {
  FileText,
  Gift,
  HeartPulse,
  GraduationCap,
  HandCoins,
} from 'lucide-react';
import bgImage from '../../images/background.png';
import { useNavigate } from 'react-router-dom';
import SideBar from "../Dashboard/SideBar";

const Home = () => {
  const navigate = useNavigate();
  const sections = [
    {
      title: 'Loans',
      description: 'Review, approve, and manage loan applications submitted by members.',
      icon: <FileText className="w-10 h-10 text-yellow-500" />,
    },
    {
      title: 'Death Funds',
      description: 'Administer and process death fund requests for eligible beneficiaries.',
      icon: <HeartPulse className="w-10 h-10 text-purple-500" />,
    },
    {
      title: 'Retirement Gifts',
      description: 'Oversee retirement gift allocations and ensure proper disbursement.',
      icon: <Gift className="w-10 h-10 text-green-500" />,
    },
    {
      title: 'Scholarships',
      description: 'Manage scholarship applications and monitor award statuses for recipients.',
      icon: <GraduationCap className="w-10 h-10 text-orange-500" />,
    },
    {
      title: 'Refunds',
      description: 'Process and verify refund claims submitted by members efficiently.',
      icon: <HandCoins className="w-10 h-10 text-pink-500" />,
    },
    {
      title: 'Medical Benefits',
      description: 'Administer medical benefit claims and maintain healthcare assistance records.',
      icon: <HeartPulse className="w-10 h-10 text-blue-500" />,
    },
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      navigate('/');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main
        className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-hidden h-screen"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 p-6">
          {/* Title */}
          <h2 className="text-3xl font-bold text-white drop-shadow mb-6">Dashboard</h2>

          {/* Cards */}
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-white/90 shadow-md p-8 rounded-xl hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer hover:bg-orange-100"
                >
                  {section.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2">{section.title}</h3>
                  <p className="text-base text-gray-600">{section.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
