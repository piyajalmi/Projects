import React from "react";
import { Link } from "react-router-dom";
import "./DashboardNavbar.css";

function DashboardNavbar() {
  return (
    <nav className="dashboard-navbar">
      <div className="logo"> <img src="/images/logo.jpg" alt="App Logo" className="navbar-logo" />
        

      </div>
      <ul className="nav-links">
        <li><Link to="/dashboard">Home</Link></li>
        <li><Link to="/my-projects">My Projects</Link></li>
        <li><Link to="/explore">Explore Projects</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}

export default DashboardNavbar;
