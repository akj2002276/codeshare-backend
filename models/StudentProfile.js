const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    leetcodeUrl: {
      type: String,
      default: "",
    },

    codechefUrl: {
      type: String,
      default: "",
    },

    githubUrl: {
      type: String,
      default: "",
    },

    linkedinUrl: {
      type: String,
      default: "",
    },

    college: {
      type: String,
      default: "",
    },

    batch: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },
    leetcodeUsername: {
  type: String,
  default: "",
},

leetcodeEasySolved: {
  type: Number,
  default: 0,
},

leetcodeMediumSolved: {
  type: Number,
  default: 0,
},

leetcodeHardSolved: {
  type: Number,
  default: 0,
},

leetcodeTotalSolved: {
  type: Number,
  default: 0,
},

lastLeetcodeSyncAt: {
  type: Date,
  default: null,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);