const express = require("express");

const protect = require("../middleware/authMiddleware");
const trainerOnly = require("../middleware/roleMiddleware");

const {
  createTicket,
  getMyTickets,
  getAllTickets,
  getActiveTicketCount,
  getSingleTicket,
  resolveTicket,
  deleteTicket,
} = require("../controllers/ticketController");

const router = express.Router();

// STUDENT
router.post("/", protect, createTicket);
router.get("/my", protect, getMyTickets);

// TRAINER
router.get("/", protect, trainerOnly, getAllTickets);
router.get("/active-count", protect, trainerOnly, getActiveTicketCount);
router.patch("/:id/resolve", protect, trainerOnly, resolveTicket);
router.delete("/:id", protect, trainerOnly, deleteTicket);

// BOTH
router.get("/:id", protect, getSingleTicket);

module.exports = router;