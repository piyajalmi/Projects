const router = require("express").Router();
const verifyToken = require("../Middleware/verifyToken");
const verifyAdmin = require("../Middleware/verifyAdmin");
const Project = require("../Models/Project");

// ✅ Get all pending projects
router.get("/pending-projects", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const projects = await Project.find({ status: "pending" }).populate("studentId", "name email");
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching projects", error: err.message });
  }
});

// ✅ Get all approved projects
router.get("/approved-projects", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const projects = await Project.find({ status: "approved" }).populate("studentId", "name email");
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching projects", error: err.message });
  }
});

// ✅ Approve a project
router.put("/approve/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.json({ success: true, message: "Project approved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error approving project", error: err.message });
  }
});

// ✅ Reject a project
router.put("/reject/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.json({ success: true, message: "Project rejected successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error rejecting project", error: err.message });
  }
});

module.exports = router;
