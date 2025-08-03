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
import ViewLoans from './pages/Dashboard/LoanManagement/ViewLoan';


import DeathFundDashboard from './pages/Dashboard/DeathFundsManagement';
import RetirementGiftsDashboard from './pages/Dashboard/RetirementGiftsManagement';
import Scholarships from './pages/Dashboard/SchoolarshipsManagement';
import RefundsDashboard from './pages/Dashboard/RefundsManagement';
import MedicalsDashboard from './pages/Dashboard/MedicalManahement';
import EditAdminForm from './pages/Dashboard/AdminManagement/EditAdminForm';


function App() {
  return (
    <div>
      <Router>
        <Routes>
            <Route path="/" element={<Root />}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/dashboard" element={<Home/>}/>
            <Route path="/auditLog" element={<AuditLog/>}/>

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
            <Route path="/viewLoans" element={<ViewLoans />} />

            
            <Route path="/deathFundDashboard" element={<DeathFundDashboard/>}/>
            <Route path="/retirementGiftsDashboard" element={<RetirementGiftsDashboard/>}/>
            <Route path="/scholarships" element={<Scholarships/>}/>
            <Route path="/refundsDashboard" element={<RefundsDashboard/>}/>
            <Route path="/medicalsDashboard" element={<MedicalsDashboard/>}/>
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