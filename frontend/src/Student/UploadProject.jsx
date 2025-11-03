import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import "../Student/UploadProject.css";

const UploadProject = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    techStack: "",
    github: "",
    hosted: "",
    linkedin: "",
    courseName: "",
    courseCode: "",
    facultyName: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in first.");
      return;
    }
    if (!file) {
      setMessage("Please select your project file (ZIP or PDF).");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (thumbnail) data.append("thumbnail", thumbnail);
    if (file) data.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/student/upload", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(res.data.message || "Project uploaded successfully!");
      setFormData({
        projectName: "",
        description: "",
        techStack: "",
        github: "",
        hosted: "",
        linkedin: "",
        courseName: "",
        courseCode: "",
        facultyName: "",
      });
      setThumbnail(null);
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Fixed Navbar */}
      <DashboardNavbar />

      {/* Scrollable centered container */}
      <div className="upload-page">
        <div className="upload-container">
          <h2 className="upload-title">Upload Your Project</h2>

          <form className="upload-form" onSubmit={handleUpload}>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Project Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Tech Stack</label>
              <input
                type="text"
                name="techStack"
                placeholder="e.g. React, Node.js, MongoDB"
                value={formData.techStack}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>GitHub Link</label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Hosted Link</label>
              <input
                type="text"
                name="hosted"
                value={formData.hosted}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>LinkedIn Link</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Course Name</label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Course Code</label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Faculty Name</label>
              <input
                type="text"
                name="facultyName"
                value={formData.facultyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Thumbnail Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                required
              />
            </div>

            <div className="form-group">
              <label>Project File (ZIP or PDF)</label>
              <input
                type="file"
                accept=".zip,.pdf"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Uploading..." : "Upload Project"}
            </button>
          </form>

          {message && (
            <p className="upload-message">{message}</p>
          )}

          <button
            onClick={() => navigate("/student/dashboard")}
            className="back-btn"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadProject;
