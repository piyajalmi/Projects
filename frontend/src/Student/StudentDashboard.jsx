import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar"; // include this!
import "../components/Dashboard.css";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/student/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || "Something went wrong.");
        setLoading(false);
      });
  }, []);
 const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate("/upload-project"); // ✅ navigate to UploadProject page
  };
  return (
    <>
      
      <div className="dashboard-page">
        {/* === Hero Section === */}
        <section className="dashboard-hero">
          <div className="dashboard-content">
            <h1>
              Upload your project <br />
              and <span>inspire fellow creators.</span>
            </h1>
            <button className="upload-btn" onClick={handleUploadClick}>Upload Your Project</button>
          </div>
        </section>

        {/* === Creative Highlights Section === */}
        
      </div>
    </>
  );
};

export default StudentDashboard;
