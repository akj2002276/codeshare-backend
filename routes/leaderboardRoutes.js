const express = require("express");

const protect = require("../middleware/authMiddleware");
const trainerOnly = require("../middleware/roleMiddleware");

const {
  getLeaderboard,
  syncAllLeaderboard,
} = require("../controllers/leaderboardController");

const router = express.Router();

router.get("/", protect, getLeaderboard);
router.post("/sync-all", protect, trainerOnly, syncAllLeaderboard);

module.exports = router;


