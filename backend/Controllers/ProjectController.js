const { BlobServiceClient } = require("@azure/storage-blob");
const multer = require("multer");
const path = require("path");
const Project = require("../Models/Project");
require("dotenv").config();

// === Initialize Azure Blob Service ===
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONN;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  console.error("❌ Missing Azure Storage connection string in .env file");
  process.exit(1);
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerName = "projectvaultfiles"; // You can rename this in Azure if needed

// === Configure Multer (file upload handler) ===
const storage = multer.memoryStorage();
const upload = multer({ storage });

// === Helper to upload a single file to Azure Blob Storage ===
async function uploadToAzure(fileBuffer, fileName, mimeType) {
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Create container if not exists
  await containerClient.createIfNotExists({ access: "container" });

  const blobName = `${Date.now()}-${fileName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: mimeType },
  });

  return blockBlobClient.url;
}

// === Controller function for uploading project ===
const uploadProject = async (req, res) => {
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

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: Invalid user" });
    }

    if (!req.files || !req.files.file || !req.files.thumbnail) {
      return res.status(400).json({ message: "Both thumbnail and project file are required" });
    }

    const thumbnail = req.files.thumbnail[0];
    const file = req.files.file[0];

    // Upload both files to Azure
    const thumbnailUrl = await uploadToAzure(
      thumbnail.buffer,
      thumbnail.originalname,
      thumbnail.mimetype
    );

    const fileUrl = await uploadToAzure(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    // Save to MongoDB
    const newProject = new Project({
      studentId: req.user._id,
      studentName: req.user.email,
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

    res.status(200).json({
      message: "✅ Project uploaded successfully!",
      project: newProject,
    });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    res.status(500).json({ message: "Server error during project upload", error: error.message });
  }
};

module.exports = {
  upload,
  uploadProject,
};
