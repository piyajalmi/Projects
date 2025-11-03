import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [viewProject, setViewProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [confirmType, setConfirmType] = useState(null); // "approve" or "reject"
  const [confirmProject, setConfirmProject] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPending();
    fetchApproved();
  }, []);

  const fetchPending = async () => {
    const res = await axios.get("http://localhost:5000/admin/pending-projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPending(res.data.projects || []);
  };

  const fetchApproved = async () => {
    const res = await axios.get("http://localhost:5000/admin/approved-projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setApproved(res.data.projects || []);
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPending();
      fetchApproved();
      setConfirmType(null);
      setConfirmProject(null);
    } catch {
      alert("❌ Error approving project. Please try again.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/admin/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPending();
      setConfirmType(null);
      setConfirmProject(null);
    } catch {
      alert("❌ Error rejecting project. Please try again.");
    }
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <h2>Admin Dashboard</h2>
        <ul>
          <li onClick={() => setViewProject(null)}>🏠 Home</li>
          <li onClick={() => setViewProject("explore")}>📂 Explore Projects</li>
          <li>👤 Profile</li>
        </ul>
      </nav>

      {/* Pending Projects */}
      {!viewProject && (
        <div className="pending-section">
          <h3>Pending Project Requests</h3>
          <div className="project-grid">
            {pending.map((p) => (
              <div
                className="project-card"
                key={p._id}
                onClick={() => setSelectedProject(p)}
              >
                <div className="card-header">{p.studentId?.name || "Unknown"}</div>
                <img src={p.thumbnailUrl} alt="thumbnail" />
                <div className="card-footer">{p.projectName}</div>

                <div className="buttons">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmType("approve");
                      setConfirmProject(p);
                    }}
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmType("reject");
                      setConfirmProject(p);
                    }}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Projects */}
      {viewProject === "explore" && (
        <div className="approved-section">
          <h3>All Approved Projects</h3>
          <div className="project-grid">
            {approved.map((p) => (
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
        </div>
      )}

      {/* Project Detail Popup */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedProject.projectName}</h2>
            <img src={selectedProject.thumbnailUrl} alt="thumbnail" />
            <p><strong>Student:</strong> {selectedProject.studentId?.name || "Unknown"}</p>
            <p><strong>Student Email:</strong> {selectedProject.studentId?.email || "N/A"}</p>
            <p><strong>Description:</strong> {selectedProject.description || "No description available."}</p>
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

      {/* ✅ Confirmation Modal */}
      {confirmType && confirmProject && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>
              {confirmType === "approve"
                ? "Approve this project?"
                : "Reject this project?"}
            </h3>
            <p>
              {confirmType === "approve"
                ? "Once approved, you cannot reject it later."
                : "Are you sure you want to reject this project?"}
            </p>
            <div className="confirm-buttons">
              <button
                className={confirmType === "approve" ? "yes-btn" : "reject-btn"}
                onClick={() =>
                  confirmType === "approve"
                    ? handleApprove(confirmProject._id)
                    : handleReject(confirmProject._id)
                }
              >
                Yes
              </button>
              <button className="cancel-btn" onClick={() => {
                setConfirmType(null);
                setConfirmProject(null);
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
