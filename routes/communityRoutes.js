const express = require("express");

const protect = require("../middleware/authMiddleware");
const trainerOnly = require("../middleware/roleMiddleware");

const {
  joinCommunity,
  getMyCommunityStatus,
  getCommunityMembers,
  getMessages,
  sendMessage,
  blockMember,
  unblockMember,
  deleteMessage,
  clearAllMessages,
} = require("../controllers/communityController");

const router = express.Router();

// STUDENT + TRAINER
router.post("/join", protect, joinCommunity);
router.get("/me", protect, getMyCommunityStatus);
router.get("/messages", protect, getMessages);
router.post("/messages", protect, sendMessage);

// TRAINER ONLY
router.get("/members", protect, trainerOnly, getCommunityMembers);
router.patch("/block/:studentId", protect, trainerOnly, blockMember);
router.patch("/unblock/:studentId", protect, trainerOnly, unblockMember);
router.delete("/messages/clear", protect, trainerOnly, clearAllMessages);
router.delete("/messages/:messageId", protect, trainerOnly, deleteMessage);
module.exports = router;