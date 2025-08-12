import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Auth/Login";
import Home from "./pages/Dashboard/Home";
import AuditLog from "./pages/Dashboard/AuditLog";

import CreateAdmin from "./pages/Dashboard/AdminManagement/CreateAdmin";
import ViewAdmin from "./pages/Dashboard/AdminManagement/ViewAdmin";
import DeleteAdmin from "./pages/Dashboard/AdminManagement/DeleteAdmin";
import UpdateAdmin from "./pages/Dashboard/AdminManagement/UpdateAdmin";
import ManageAdmins from './pages/Dashboard/AdminManagement/ManageAdmins';

import CreateEmployee from './pages/Dashboard/EmployeeManagement/CreateEmployee';
import ViewEmployees from './pages/Dashboard/EmployeeManagement/ViewEmployee';
import ViewEmployeeById from './pages/Dashboard/EmployeeManagement/ViewEmployeeById';
import UpdateEmployee from './pages/Dashboard/EmployeeManagement/UpdateEmployee';
import EditEmployeeForm from './pages/Dashboard/EmployeeManagement/EditEmployeeForm';
import ViewRetiredEmployees from './pages/Dashboard/EmployeeManagement/ViewRetiredEmployees';
import ManageEmployees from './pages/Dashboard/EmployeeManagement/ManageEmployees';

import LoansManagement from './pages/Dashboard/LoanManagement/LoansManagement';
import CreateLoan from './pages/Dashboard/LoanManagement/CreateLoan';
// import ViewLoans from './pages/Dashboard/LoanManagement/ViewLoan';
import ViewAllLoans from './pages/Dashboard/LoanManagement/ViewAllLoans';
import ViewPendingLoans from './pages/Dashboard/LoanManagement/ViewPendingLoans';
import ViewApprovedLoans from './pages/Dashboard/LoanManagement/ViewApprovedLoans';
import ViewRejectedLoans from './pages/Dashboard/LoanManagement/ViewRejectedLoans';



import RetirementGiftsDashboard from './pages/Dashboard/RetirementGiftsManagement';
import Scholarships from './pages/Dashboard/SchoolarshipsManagement';
import RefundsDashboard from './pages/Dashboard/RefundsManagement';
import MedicalsDashboard from './pages/Dashboard/MedicalManahement';

import EditAdminForm from './pages/Dashboard/AdminManagement/EditAdminForm';

import LoanApplication from './pages/Applications/LoanApplication';
import DeathFundForm from './pages/Applications/DeathFundApplication';
import RetirementForm from './pages/Applications/RetirementGiftApplication';
import ScholarshipForm from './pages/Applications/ScholarshipApplication';
import RefundForm from './pages/Applications/RefundsApplication';
import MedicalForm from './pages/Applications/MedicalApplication';

function App() {
  return (
    <div>
      <Router>
        <Routes>
            <Route path="/" element={<Root />}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/dashboard" element={<Home/>}/>
            <Route path="/logs" element={<AuditLog/>}/>

             {/* Admin Routes */}
            <Route path="/manageAdmins" element={<ManageAdmins/>}/>
            <Route path="/createAdmin" element={<CreateAdmin/>}/>
            <Route path="/viewAdmin" element={<ViewAdmin/>}/>
            <Route path="/deleteAdmin" element={<DeleteAdmin/>}/>
            <Route path="/updateAdmin" element={<UpdateAdmin/>}/>
            <Route path="/updateAdmin/:id" element={<EditAdminForm />} />
            

            {/* Employee  Routes */}
            <Route path="/manageEmployees" element={<ManageEmployees/>}/>
            <Route path="/createEmployee" element={<CreateEmployee/>}/>
            <Route path="/viewEmployees" element={<ViewEmployees/>}/>
            <Route path="/viewEmployee/:id" element={<ViewEmployeeById/>}/>
            <Route path="/updateEmployee" element={<UpdateEmployee />} />
            <Route path="/updateEmployee/:id" element={<EditEmployeeForm />} />
            <Route path="/viewRetiredEmployees" element={<ViewRetiredEmployees />} />

            {/* Loan Management */}
            <Route path="/loansManagement" element={<LoansManagement/>}/>
            <Route path="/createLoan" element={<CreateLoan/>}/>
            {/* <Route path="/viewLoans" element={<ViewLoans />} /> */}
            <Route path="/viewLoans" element={<ViewAllLoans />} />
            <Route path="/viewLoans/pending" element={<ViewPendingLoans />} />
            <Route path="/viewLoans/approved" element={<ViewApprovedLoans />} />
            <Route path="/viewLoans/rejected" element={<ViewRejectedLoans />} />


            <Route path="/retirementGiftsDashboard" element={<RetirementGiftsDashboard/>}/>
            <Route path="/scholarships" element={<Scholarships/>}/>
            <Route path="/refundsDashboard" element={<RefundsDashboard/>}/>
            <Route path="/medicalsDashboard" element={<MedicalsDashboard/>}/>
            <Route path="/loanApplication" element={<LoanApplication/>}/>
            <Route path="/deathFundForm" element={<DeathFundForm/>}/>
            <Route path="/retirementForm" element={<RetirementForm/>}/>
            <Route path="/scholarshipForm" element={<ScholarshipForm/>}/>
            <Route path="/refundForm" element={<RefundForm/>}/>
            <Route path="/medicalForm" element={<MedicalForm/>}/>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;

const Root = () => {
  //Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  //Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/login" />
   ) : (
    <Navigate to="/dashboard" />
   );
};