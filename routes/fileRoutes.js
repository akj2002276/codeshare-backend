const express = require("express");

const protect = require("../middleware/authMiddleware");
const trainerOnly = require("../middleware/roleMiddleware");

const {
  createFile,
  getFilesByTopic,
  getSingleFile,
  updateCode,
  deleteFile,
} = require("../controllers/fileController");

const router = express.Router();


// CREATE FILE
router.post("/", protect, trainerOnly, createFile);


// GET FILES BY TOPIC
router.get("/topic/:topicId", protect, getFilesByTopic);


// GET SINGLE FILE
router.get("/:id", protect, getSingleFile);


// UPDATE CODE
router.put("/:id", protect, trainerOnly, updateCode);


// DELETE FILE
router.delete("/:id", protect, trainerOnly, deleteFile);


module.exports = router;