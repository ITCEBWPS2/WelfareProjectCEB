import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import bgImage from '../../../images/background.png';
import SideBar from "../SideBar";

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    salutation: "Mr",
    name: "",
    email: "",
    dateOfBirth: "",
    epfNumber: "",
    dateJoined: "",
    dateRegistered: "",
    welfareNumber: "",
    role: "",
    payroll: "",
    division: "",
    branch: "",
    unit: "",
    whatsappNumber: "",
    contactNumber: "",
    spouse: { name: "", dateOfBirth: "" },
    mother: { name: "", dateOfBirth: "" },
    father: { name: "", dateOfBirth: "" },
    motherInLaw: { name: "", dateOfBirth: "" },
    fatherInLaw: { name: "", dateOfBirth: "" },
    children: [],
  });

  const [child, setChild] = useState({ name: "", dateOfBirth: "", gender: "Male" });

  const handleChange = (e, nested = false, field = "") => {
    const { name, value } = e.target;
    if (nested) {
      setForm(prev => ({ ...prev, [field]: { ...prev[field], [name]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddChild = () => {
    if (!child.name.trim() || !child.dateOfBirth || !child.gender) {
      return Swal.fire("Incomplete", "Please fill in all child fields before adding.", "warning");
    }

    if (editingIndex !== null) {
      // Update existing child
      const updatedChildren = [...form.children];
      updatedChildren[editingIndex] = child;
      setForm(prev => ({ ...prev, children: updatedChildren }));
      setEditingIndex(null);
    } else {
      // Add new child
      setForm(prev => ({ ...prev, children: [...prev.children, child] }));
    }

    // Reset form
    setChild({ name: "", dateOfBirth: "", gender: "Male" });
  };

  const handleEditChild = (index) => {
    setChild(form.children[index]);
    setEditingIndex(index);
  };

  const handleDeleteChild = (index) => {
    const updatedChildren = form.children.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, children: updatedChildren }));
    if (editingIndex === index) {
      setChild({ name: "", dateOfBirth: "", gender: "Male" });
      setEditingIndex(null);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8070/api/v1/employee/createEmployee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create employee");

      Swal.fire({
        title: 'Success!',
        text: 'Employee created successfully!',
        icon: 'success',
        confirmButtonColor: '#f97316',
        confirmButtonText: 'OK'
      }).then(() => navigate("/manageEmployees"));
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="flex h-screen">
      <SideBar />
      <main className="flex-1 relative bg-cover bg-center bg-no-repeat overflow-hidden" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 px-6 pt-6 pb-20">
          <h2 className="text-3xl font-bold text-white mb-6">New Employee</h2>
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-md max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Step 1: Personal Data */}
              {step === 1 && (
                <>
                  <h3 className="text-xl font-semibold text-orange-600 text-center">Employee Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label htmlFor="salutation" className="text-sm font-medium text-gray-700 mb-1">Salutation<span className="text-red-500">*</span></label>
                      <select id="salutation" name="salutation" value={form.salutation} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">Full Name<span className="text-red-500">*</span></label>
                      <input type="text" id="name" name="name" value={form.name} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
                      <input type="email" id="email" name="email" value={form.email} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700 mb-1">Date of Birth<span className="text-red-500">*</span></label>
                      <input type="date" id="dateOfBirth" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="whatsappNumber" className="text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                      <input type="text" id="whatsappNumber" name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="contactNumber" className="text-sm font-medium text-gray-700 mb-1">Contact Number<span className="text-red-500">*</span></label>
                      <input type="text" id="contactNumber" name="contactNumber" value={form.contactNumber} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>  

                  </div>
                </>
              )}

              {/* Step 2: Work Data */}
              {step === 2 && (
                <>
                  <h3 className="text-xl font-semibold text-orange-600  text-center">Employee Work Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <label htmlFor="epfNumber" className="text-sm font-medium text-gray-700 mb-1">EPF Number<span className="text-red-500">*</span></label>
                      <input type="text" id="epfNumber" name="epfNumber" value={form.epfNumber} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="dateJoined" className="text-sm font-medium text-gray-700 mb-1">Date Joined<span className="text-red-500">*</span></label>
                      <input type="date" id="dateJoined" name="dateJoined" value={form.dateJoined} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="dateRegistered" className="text-sm font-medium text-gray-700 mb-1">Date Registered<span className="text-red-500">*</span></label>
                      <input type="date" id="dateRegistered" name="dateRegistered" value={form.dateRegistered} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" required />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="welfareNumber" className="text-sm font-medium text-gray-700 mb-1">Welfare Number<span className="text-red-500">*</span></label>
                      <input type="text" id="welfareNumber" name="welfareNumber" value={form.welfareNumber} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="role" className="text-sm font-medium text-gray-700 mb-1">Role<span className="text-red-500">*</span></label>
                      <input type="text" id="role" name="role" value={form.role} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="payroll" className="text-sm font-medium text-gray-700 mb-1">Payroll<span className="text-red-500">*</span></label>
                      <input type="text" id="payroll" name="payroll" value={form.payroll} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="division" className="text-sm font-medium text-gray-700 mb-1">Division<span className="text-red-500">*</span></label>
                      <input type="text" id="division" name="division" value={form.division} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="branch" className="text-sm font-medium text-gray-700 mb-1">Branch<span className="text-red-500">*</span></label>
                      <input type="text" id="branch" name="branch" value={form.branch} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="unit" className="text-sm font-medium text-gray-700 mb-1">Unit<span className="text-red-500">*</span></label>
                      <input type="text" id="unit" name="unit" value={form.unit} onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>

                  </div>
                </>
              )}

              {/* Step 3: Spouse and Children */}
              {step === 3 && (
                <>
                  <h3 className="text-xl font-semibold text-orange-600 text-center">Spouse & Children Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label htmlFor="spouseName" className="text-sm font-medium text-gray-700 mb-1">Spouse Name</label>
                      <input id="spouseName" name="name" value={form.spouse.name} onChange={(e) => handleChange(e, true, "spouse")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="spouseDOB" className="text-sm font-medium text-gray-700 mb-1">Spouse Date of Birth</label>
                      <input type="date" id="spouseDOB" name="dateOfBirth" value={form.spouse.dateOfBirth} onChange={(e) => handleChange(e, true, "spouse")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-2">Children</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input type="text" placeholder="Child Name" value={child.name}
                        onChange={(e) => setChild({ ...child, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                      <input type="date" value={child.dateOfBirth}
                        onChange={(e) => setChild({ ...child, dateOfBirth: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
                      <select
                        value={child.gender}
                        onChange={(e) => setChild({ ...child, gender: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <button type="button" onClick={handleAddChild} className="text-sm text-orange-600 hover:underline mt-2">+ Add Child</button>
                    <ul className="mt-2 text-sm space-y-2">
                      {form.children.map((c, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border">
                          <span>👦🏻 {c.name} | {c.gender} | {c.dateOfBirth}</span>
                          <div className="space-x-2">
                            <button type="button" onClick={() => handleEditChild(index)} className="text-orange-500 text-xs hover:underline">Edit</button>
                            <button type="button" onClick={() => handleDeleteChild(index)} className="text-red-500 text-xs hover:underline">Delete</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Step 4: Parents Data */}
              {step === 4 && (
                <>
                  <h3 className="text-xl font-semibold text-orange-600 text-center">Employee Parents' Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: "mother", label: "Mother's", required: true },
                      { key: "father", label: "Father's", required: true },
                      { key: "motherInLaw", label: "Mother-in-Law's", required: false },
                      { key: "fatherInLaw", label: "Father-in-Law's", required: false },
                    ].map(({ key, label, required }) => (
                      <React.Fragment key={key}>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-1">
                            {label} Name {required && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={form[key].name}
                            onChange={(e) => handleChange(e, true, key)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-700 mb-1">
                            {label} Date of Birth {required && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={form[key].dateOfBirth}
                            onChange={(e) => handleChange(e, true, key)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                          />
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </>
              )}




              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                {step > 1 && <button type="button" onClick={prevStep} className="text-orange-500 hover:underline">← Back</button>}
                {step < 4 && <button type="button" onClick={nextStep} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">Next →</button>}
                {step === 4 && (
                  <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">Submit</button>
                )}
              </div>

            </form>
          </div>
        </div>
        <Link to="/manageEmployees" className="absolute bottom-4 right-6 text-white text-sm cursor-pointer hover:underline">Back</Link>
      </main>
    </div>
  );
};

export default CreateEmployee;
