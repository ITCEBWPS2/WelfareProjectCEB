import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SideBar from '../../Dashboard/SideBar';
import bgImage from '../../../images/background.png';

const ViewEmployeeById = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`http://localhost:8070/api/v1/employee/viewEmployee/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch employee");
        setEmployee(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEmployee();
  }, [id]);

  if (error) {
    return <div className="text-center text-red-600 mt-4">{error}</div>;
  }

  if (!employee) {
    return <div className="text-center text-orange-500 mt-4">Loading employee details...</div>;
  }

  return (
    <div className="flex h-screen">
      <SideBar />
      <main
        className="flex-1 bg-cover bg-center bg-no-repeat relative overflow-y-auto"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-x-0 top-0 h-[1150px] bg-black/30 z-0" />
        <div className="relative z-10 p-6 max-w-5xl mx-auto text-sm space-y-10">
          <h2 className="text-3xl font-bold text-white mb-6">Employee Details</h2>
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-md space-y-8">

            {/* Personal Info */}
            <section>
              <h3 className="text-xl font-semibold text-orange-600 mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Info label="Salutation" value={employee.salutation} />
                <Info label="Name with Initials" value={employee.name} />
                <Info label="Email" value={employee.email} />
                <Info label="Date of Birth" value={employee.dateOfBirth?.slice(0, 10)} />
                <Info label="WhatsApp Number" value={employee.whatsappNumber} />
                <Info label="Contact Number" value={employee.contactNumber} />
              </div>
            </section>

            {/* Work Info */}
            <section>
              <h3 className="text-xl font-semibold text-orange-600 mb-4">Work Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Info label="EPF Number" value={employee.epfNumber} />
                <Info label="Date Joined" value={employee.dateJoined?.slice(0, 10)} />
                <Info label="Date Registered" value={employee.dateRegistered?.slice(0, 10)} />
                <Info label="Welfare Number" value={employee.welfareNumber} />
                <Info label="role" value={employee.role} />
                <Info label="Payroll" value={employee.payroll} />
                <Info label="Division" value={employee.division} />
                <Info label="Branch" value={employee.branch} />
                <Info label="Unit" value={employee.unit} />
              </div>
            </section>

            {/* Spouse */}
            <section>
              <h3 className="text-xl font-semibold text-orange-600 mb-4">Spouse Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Info label="Spouse Name" value={employee.spouse?.name || "-"} />
                <Info label="Spouse Date of Birth" value={employee.spouse?.dateOfBirth?.slice(0, 10) || "-"} />
              </div>
            </section>

            {/* Children */}
            <section>
              <h3 className="text-xl font-semibold text-orange-600 mb-4">Children</h3>
              {employee.children.length > 0 ? (
                <ul className="space-y-2">
                  {employee.children.map((c, i) => (
                    <li key={i} className="bg-gray-50 border p-2 rounded-lg">
                      👶 {c.name} | {c.gender} | {c.dateOfBirth?.slice(0, 10)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No children information available.</p>
              )}
            </section>

            {/* Parents */}
            <section>
              <h3 className="text-xl font-semibold text-orange-600 mb-4">Parents</h3>
              <div className="grid grid-cols-2 gap-4">
                <Info label="Mother's Name" value={employee.mother.name} />
                <Info label="Mother's Date of Birth" value={employee.mother.dateOfBirth?.slice(0, 10)} />
                <Info label="Father's Name" value={employee.father.name} />
                <Info label="Father's Date of Birth" value={employee.father.dateOfBirth?.slice(0, 10)} />
                <Info label="Mother-in-Law's Name" value={employee.motherInLaw?.name || "-"} />
                <Info label="Mother-in-Law's Date of Birth" value={employee.motherInLaw?.dateOfBirth?.slice(0, 10) || "-"} />
                <Info label="Father-in-Law's Name" value={employee.fatherInLaw?.name || "-"} />
                <Info label="Father-in-Law's Date of Birth" value={employee.fatherInLaw?.dateOfBirth?.slice(0, 10) || "-"} />
              </div>
            </section>
          </div>

          <Link to="/manageEmployees" className="text-white text-sm hover:underline block text-right mt-4">
            ← Back
          </Link>
        </div>
      </main>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value || "-"}</p>
  </div>
);

export default ViewEmployeeById;
