import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,}from "react-router-dom";
import Login from "./pages/Auth/Login";
import CreateAdmin from "./pages/Auth/CreateAdmin";
import Home from "./pages/Dashboard/Home";
import AuditLog from "./pages/Dashboard/AuditLog";
import UserManagement from "./pages/Dashboard/UserManagement";


function App() {
  return (
    <div>
      <Router>
        <Routes>
            <Route path="/" element={<Root />}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/createAdmin" element={<CreateAdmin/>}/>
            <Route path="/dashboard" element={<Home/>}/>
            <Route path="/auditLog" element={<AuditLog/>}/>
            <Route path="/userManagement" element={<UserManagement/>}/>
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