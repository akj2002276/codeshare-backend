const Ticket = require("../models/Ticket");

// CREATE TICKET - STUDENT
const createTicket = async (req, res) => {
  try {
    const { title, language, doubt, originalCode } = req.body;

    if (!title || !language || !doubt || !originalCode) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const ticket = await Ticket.create({
      student: req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      title,
      language,
      doubt,
      originalCode,
    });

    res.status(201).json({
      message: "Ticket raised successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET MY TICKETS - STUDENT
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      student: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL TICKETS - TRAINER
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .sort({
        createdAt: -1,
      })
      .populate("student", "name email")
      .populate("resolvedBy", "name email");

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ACTIVE TICKET COUNT - TRAINER
const getActiveTicketCount = async (req, res) => {
  try {
    const count = await Ticket.countDocuments({
      status: "pending",
    });

    res.status(200).json({
      count,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE TICKET
const getSingleTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("student", "name email")
      .populate("resolvedBy", "name email");

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const isOwner =
      ticket.student._id.toString() === req.user._id.toString();

    const isTrainer = req.user.role === "trainer";

    if (!isOwner && !isTrainer) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// RESOLVE TICKET - TRAINER
const resolveTicket = async (req, res) => {
  try {
    const { resolvedCode, trainerFeedback } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    ticket.resolvedCode = resolvedCode || ticket.originalCode;
    ticket.trainerFeedback = trainerFeedback || "";
    ticket.status = "resolved";
    ticket.resolvedAt = new Date();
    ticket.resolvedBy = req.user._id;

    await ticket.save();

    res.status(200).json({
      message: "Ticket resolved successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE TICKET - TRAINER
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    await ticket.deleteOne();

    res.status(200).json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getAllTickets,
  getActiveTicketCount,
  getSingleTicket,
  resolveTicket,
  deleteTicket,
};