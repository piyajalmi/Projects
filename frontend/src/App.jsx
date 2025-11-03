//import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// ✅ Landing page + navbars
import Navbar from "./components/Navbar";
import DashboardNavbar from "./components/DashboardNavbar";
import Hero from "./components/Hero";
import UploadProject from "./Student/UploadProject";
import ExportProjects from "./Student/ExportProjects"; 
import AdminDashboard from "./Admin/AdminDashboard";
import React, { useEffect, useState } from "react";


// ✅ Login & Signup (final project versions)
import Login from "./Shared/Login";
import Signup from "./Student/Signup";
import AdminSignup from './Admin/AdminSignup';

// ✅ Dashboards
import StudentDashboard from "./Student/StudentDashboard";
// You can later add admin dashboard route if needed

function AppContent() {
  const location = useLocation();

  // ✅ Control which navbar shows
  const showLandingNavbar = ["/"].includes(location.pathname);

  const showDashboardNavbar = ["/student/dashboard"].includes(location.pathname);

  return (
    <div>
      {showLandingNavbar && <Navbar />}
      {showDashboardNavbar && <DashboardNavbar />}

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Hero />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/student/signup" element={<Signup />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
       <Route path="/explore" element={<ExportProjects />} /> {/* ✅ Add this */}
       <Route path="/dashboard" element={<StudentDashboard />} /> {/* ✅ Add this */}
        {/* Dashboards */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/upload-project" element={<UploadProject />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
