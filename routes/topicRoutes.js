const express = require("express");

const protect = require("../middleware/authMiddleware");
const trainerOnly = require("../middleware/roleMiddleware");

const {
  createTopic,
  getTopicsByBatch,
  deleteTopic,
} = require("../controllers/topicController");

const router = express.Router();


// CREATE TOPIC
router.post("/", protect, trainerOnly, createTopic);


// GET TOPICS BY BATCH
router.get("/:batchId", protect, getTopicsByBatch);


// DELETE TOPIC
router.delete("/:id", protect, trainerOnly, deleteTopic);


module.exports = router;