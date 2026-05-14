const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    contestName: {
      type: String,
      required: true,
    },

    batchName: {
      type: String,
      required: true,
    },

    platform: {
      type: String,
      required: true,
      default: "HackerRank",
    },

    contestLink: {
      type: String,
      required: true,
    },

    contestDate: {
      type: String,
      required: true,
    },

    contestTime: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contest", contestSchema);