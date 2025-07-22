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
  import SideBar from './SideBar';
  import Swal from "sweetalert2";

  const Home = () => {
    const navigate = useNavigate();

    const sections = [
      {
        title: 'Loans',
        description: 'Review, approve, and manage loan applications submitted by members.',
        icon: <FileText className="w-10 h-10 text-yellow-500" />,
        path: '/loansManagement', 
      },
      {
        title: 'Death Funds',
        description: 'Administer and process death fund requests for eligible beneficiaries.',
        icon: <HeartPulse className="w-10 h-10 text-purple-500" />,
        path: '/deathFundDashboard'
      },
      {
        title: 'Retirement Gifts',
        description: 'Oversee retirement gift allocations and ensure proper disbursement.',
        icon: <Gift className="w-10 h-10 text-green-500" />,
        path: '/retirementGiftsDashboard'
      },
      {
        title: 'Scholarships',
        description: 'Manage scholarship applications and monitor award statuses for recipients.',
        icon: <GraduationCap className="w-10 h-10 text-orange-500" />,
        path: '/scholarships'
      },
      {
        title: 'Refunds',
        description: 'Process and verify refund claims submitted by members efficiently.',
        icon: <HandCoins className="w-10 h-10 text-pink-500" />,
        path: '/refundsDashboard'
      },
      {
        title: 'Medical Benefits',
        description: 'Administer medical benefit claims and maintain healthcare assistance records.',
        icon: <HeartPulse className="w-10 h-10 text-blue-500" />,
        path: '/medicalsDashboard'
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
        navigate("/login");
      }
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
                    onClick={() => {
                      if (section.path) {
                        navigate(section.path); 
                      }
                    }}
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
