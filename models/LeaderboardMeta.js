const mongoose = require("mongoose");

const leaderboardMetaSchema = new mongoose.Schema(
  {
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "LeaderboardMeta",
  leaderboardMetaSchema
);