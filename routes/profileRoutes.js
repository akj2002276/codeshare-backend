const express = require("express");

const protect = require("../middleware/authMiddleware");
const trainerOnly = require("../middleware/roleMiddleware");

const {
  getMyProfile,
  saveMyProfile,
  getAllProfiles,
  syncMyLeetCodeStats,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/me", protect, getMyProfile);

router.post("/me", protect, saveMyProfile);

router.post("/sync-leetcode", protect, syncMyLeetCodeStats);

router.get("/", protect, trainerOnly, getAllProfiles);

module.exports = router;