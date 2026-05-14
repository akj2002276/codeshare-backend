const express = require("express");

const protect = require("../middleware/authMiddleware");
const trainerOnly = require("../middleware/roleMiddleware");

const {
  createContest,
  getContests,
  deleteContest,
} = require("../controllers/contestController");

const router = express.Router();

router.post("/", protect, trainerOnly, createContest);

router.get("/", protect, getContests);

router.delete("/:id", protect, trainerOnly, deleteContest);

module.exports = router;