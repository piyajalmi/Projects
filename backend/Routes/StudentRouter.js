require('dotenv').config();


const router = require("express").Router();
const verifyToken = require("../Middleware/verifyToken");
const verifyStudent = require("../Middleware/verifyStudent");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { BlobServiceClient } = require("@azure/storage-blob");
const Project = require("../Models/Project");

// Multer for temporary file storage
const upload = multer({ dest: "uploads/" });

// ✅ Student Dashboard route
router.get("/dashboard", verifyToken, verifyStudent, (req, res) => {
  return res.json({
    message: `Welcome to Student Dashboard, ${req.user.email}`,
    userId: req.user._id,
  });
});

// ✅ Fetch approved projects (visible to all students)
router.get("/approved-projects", verifyToken, verifyStudent, async (req, res) => {
  try {
    const projects = await Project.find({ status: "approved" })
      .populate("studentId", "name email");
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching approved projects", error: err.message });
  }
});

// ✅ Upload Project route (supports thumbnail + ZIP/PDF)
router.post(
  "/upload",
  verifyToken,
  verifyStudent,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        projectName,
        description,
        techStack,
        github,
        hosted,
        linkedin,
        courseName,
        courseCode,
        facultyName,
      } = req.body;

      const thumbnail = req.files?.thumbnail?.[0];
      const file = req.files?.file?.[0];

      if (!file || !thumbnail)
        return res.status(400).json({ message: "Thumbnail and project file are required." });

      // ✅ Azure Blob Storage setup
      const connectionString = process.env.AZURE_STORAGE_CONN;
      if (!connectionString)
        return res.status(500).json({ message: "Azure Storage connection string missing!" });

      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      const containerClient = blobServiceClient.getContainerClient("project-files");

      // Create container if not exists
      await containerClient.createIfNotExists({ access: "container" });

      // Upload thumbnail
      const thumbnailBlob = Date.now() + "-thumb-" + path.basename(thumbnail.originalname);
      const thumbnailBlobClient = containerClient.getBlockBlobClient(thumbnailBlob);
      await thumbnailBlobClient.uploadFile(thumbnail.path);
      const thumbnailUrl = thumbnailBlobClient.url;

      // Upload project file
      const fileBlob = Date.now() + "-file-" + path.basename(file.originalname);
      const fileBlobClient = containerClient.getBlockBlobClient(fileBlob);
      await fileBlobClient.uploadFile(file.path);
      const fileUrl = fileBlobClient.url;

      // ✅ Save to MongoDB
      const newProject = new Project({
        studentId: req.user._id,
        studentName: req.user.name || "Unknown",
        projectName,
        description,
        techStack,
        github,
        hosted,
        linkedin,
        courseName,
        courseCode,
        facultyName,
        thumbnailUrl,
        fileUrl,
        status: "pending",
      });

      await newProject.save();

      // Remove temp files
      fs.unlinkSync(file.path);
      fs.unlinkSync(thumbnail.path);

      return res.status(201).json({
        message: "Project uploaded successfully. Awaiting admin approval.",
        fileUrl,
        thumbnailUrl,
      });
    } catch (err) {
      console.error("❌ Upload Error:", err);
      return res.status(500).json({
        message: "Upload failed.",
        error: err.message,
      });
    }
  }
);

module.exports = router;
