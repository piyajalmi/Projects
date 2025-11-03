import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";
import "../Student/ExportProjects.css";

const ExportProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchApprovedProjects();
  }, []);

  const fetchApprovedProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/student/approved-projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Error fetching approved projects:", err);
    }
  };

  return (
    <>
      <DashboardNavbar />
      <div className="export-container">
        <h2>🌟 Explore Projects</h2>
        <div className="project-grid">
          {projects.map((p) => (
            <div
              className="project-card"
              key={p._id}
              onClick={() => setSelectedProject(p)}
            >
              <div className="card-header">{p.studentId?.name || "Unknown"}</div>
              <img src={p.thumbnailUrl} alt="thumbnail" />
              <div className="card-footer">{p.projectName}</div>
            </div>
          ))}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{selectedProject.projectName}</h2>
              <img src={selectedProject.thumbnailUrl} alt="thumbnail" />
              <p><strong>Student:</strong> {selectedProject.studentId?.name || "Unknown"}</p>
              <p><strong>Email:</strong> {selectedProject.studentId?.email || "N/A"}</p>
              <p><strong>Description:</strong> {selectedProject.description || "No description provided."}</p>
              <p><strong>Tech Stack:</strong> {selectedProject.techStack || "Not specified"}</p>
              <p>
                <strong>GitHub:</strong>{" "}
                {selectedProject.github ? (
                  <a
                    href={
                      selectedProject.github.startsWith("http")
                        ? selectedProject.github
                        : `https://${selectedProject.github}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedProject.github}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                {selectedProject.linkedin ? (
                  <a
                    href={
                      selectedProject.linkedin.startsWith("http")
                        ? selectedProject.linkedin
                        : `https://${selectedProject.linkedin}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedProject.linkedin}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                <strong>ZIP File:</strong>{" "}
                {selectedProject.fileUrl ? (
                  <a href={selectedProject.fileUrl} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                ) : (
                  "No file uploaded"
                )}
              </p>
              <button className="close-btn" onClick={() => setSelectedProject(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ExportProjects;
