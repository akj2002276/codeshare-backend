const express = require("express");

const protect = require("../middleware/authMiddleware");
const trainerOnly = require("../middleware/roleMiddleware");
const {
  createBatch,
  getBatches,
  deleteBatch,
} = require("../controllers/batchController");

const router = express.Router();


// CREATE BATCH
// router.post("/", protect, createBatch);
router.post("/", protect, trainerOnly, createBatch);

// GET ALL BATCHES
router.get("/", protect, getBatches);


// DELETE BATCH
// router.delete("/:id", protect, deleteBatch);
router.delete("/:id", protect, trainerOnly, deleteBatch);


module.exports = router;