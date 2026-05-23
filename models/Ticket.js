const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studentName: {
      type: String,
      required: true,
    },

    studentEmail: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
      default: "javascript",
    },

    doubt: {
      type: String,
      required: true,
    },

    originalCode: {
      type: String,
      required: true,
    },

    resolvedCode: {
      type: String,
      default: "",
    },

    trainerFeedback: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);