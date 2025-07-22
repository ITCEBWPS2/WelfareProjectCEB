import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Auth/Login";
import CreateAdmin from "./pages/Dashboard/CreateAdmin";
import ViewAdmin from "./pages/Dashboard/ViewAdmin";
import Home from "./pages/Dashboard/Home";
import AuditLog from "./pages/Dashboard/AuditLog";
import UserManagement from "./pages/Dashboard/UserManagement";
import ManageAdmins from './pages/Dashboard/ManageAdmins';
import ManageEmployees from './pages/Dashboard/ManageEmployees';
import LoansManagement from './pages/Dashboard/LoansManagement';
import DeathFundDashboard from './pages/Dashboard/DeathFundsManagement';
import RetirementGiftsDashboard from './pages/Dashboard/RetirementGiftsManagement';
import Scholarships from './pages/Dashboard/SchoolarshipsManagement';
import RefundsDashboard from './pages/Dashboard/RefundsManagement';
import MedicalsDashboard from './pages/Dashboard/MedicalManahement';
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
            <Route path="/createAdmin" element={<CreateAdmin/>}/>
            <Route path="/viewAdmin" element={<ViewAdmin/>}/>
            <Route path="/dashboard" element={<Home/>}/>
            <Route path="/auditLog" element={<AuditLog/>}/>
            <Route path="/userManagement" element={<UserManagement/>}/>
            <Route path="/manageAdmins" element={<ManageAdmins/>}/>
            <Route path="/manageEmployees" element={<ManageEmployees/>}/>
            <Route path="/loansManagement" element={<LoansManagement/>}/>
            <Route path="/deathFundDashboard" element={<DeathFundDashboard/>}/>
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
    <Navigate to="/dashboard" />
   ) : (
    <Navigate to="/login" />
   );
};