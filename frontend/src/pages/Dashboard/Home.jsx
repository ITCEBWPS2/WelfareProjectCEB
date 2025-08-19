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
import SideBar from '../Dashboard/SideBar';
import { LogOut } from "lucide-react";  
import Swal from "sweetalert2";

const Home = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Loans',
      description: 'Review, approve, and manage loan applications submitted by members.',
      icon: <FileText className="w-10 h-10 text-yellow-500" />,
      path: '/loansManagement',
      hoverColor: "hover:bg-yellow-100",
      hoverBorder: "border-yellow-100"
    },
    {
      title: 'Death Funds',
      description: 'Administer and process death fund requests for eligible beneficiaries.',
      icon: <HeartPulse className="w-10 h-10 text-purple-500" />,
      path: '/deathFundManagement',
      hoverColor: "hover:bg-purple-100",
      hoverBorder: "border-purple-100"
    },
    {
      title: 'Retirement Gifts',
      description: 'Oversee retirement gift allocations and ensure proper disbursement.',
      icon: <Gift className="w-10 h-10 text-green-500" />,
      path: '/retirementGiftManagement',
      hoverColor: "hover:bg-green-100",
      hoverBorder: "border-green-100"
    },
    {
      title: 'Scholarships',
      description: 'Manage scholarship applications and monitor award statuses for recipients.',
      icon: <GraduationCap className="w-10 h-10 text-orange-500" />,
      path: '/scholarships',
      hoverColor: "hover:bg-orange-100",
      hoverBorder: "border-orange-100"
    },
    {
      title: 'Refunds',
      description: 'Process and verify refund claims submitted by members efficiently.',
      icon: <HandCoins className="w-10 h-10 text-pink-500" />,
      path: '/refundsDashboard',
      hoverColor: "hover:bg-pink-100",
      hoverBorder: "border-pink-100"
    },
    {
      title: 'Medical Benefits',
      description: 'Administer medical benefit claims and maintain healthcare assistance records.',
      icon: <HeartPulse className="w-10 h-10 text-blue-500" />,
      path: '/medicalsDashboard',
      hoverColor: "hover:bg-blue-100",
      hoverBorder: "border-blue-100"
    },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log me out!",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Logged Out",
        text: "You have been successfully logged out.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
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
          <h2 className="text-3xl font-bold text-white drop-shadow mt-8">
            Welcome to Welfare Portal !!
          </h2>

          <div className="pt-8 pb-2">
            <button
              onClick={handleLogout}
              className="absolute top-6 right-6 flex items-center gap-2 px-5 py-2 rounded-xl 
             bg-green-500 text-white font-semibold shadow-md hover:bg-green-600 
             hover:shadow-lg active:scale-95 transition-all duration-300"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>

          {/* Cards */}
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
              {sections.map((section, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (section.path) {
                      navigate(section.path);
                    }
                  }}
                  className={`bg-white/90 shadow-md p-8 rounded-xl 
                              hover:shadow-xl transform hover:scale-105 
                              transition duration-300 cursor-pointer border-2 border-transparent 
                              ${section.hoverColor} ${section.hoverBorder}`}
                >
                  {section.icon}
                  <h3 className="text-xl font-semibold mt-4 mb-2">
                    {section.title}
                  </h3>
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
