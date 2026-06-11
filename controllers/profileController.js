const StudentProfile = require("../models/StudentProfile");

const {
  extractLeetCodeUsername,
  fetchLeetCodeStats,
} = require("../utils/leetcodeService");

// GET MY PROFILE
const getMyProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      user: req.user._id,
    });

    res.status(200).json({
      profileCompleted: !!profile?.profileCompleted,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE OR UPDATE PROFILE
const saveMyProfile = async (req, res) => {
  try {
    const {
      leetcodeUrl,
      codechefUrl,
      githubUrl,
      linkedinUrl,
      college,
      batch,
      bio,
    } = req.body;

    const profileCompleted =
      leetcodeUrl &&
      githubUrl &&
      linkedinUrl &&
      college &&
      batch;

    const leetcodeUsername =
      extractLeetCodeUsername(leetcodeUrl);

    let profile = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (profile) {
      profile.leetcodeUrl = leetcodeUrl || "";
      profile.leetcodeUsername = leetcodeUsername || "";
      profile.codechefUrl = codechefUrl || "";
      profile.githubUrl = githubUrl || "";
      profile.linkedinUrl = linkedinUrl || "";
      profile.college = college || "";
      profile.batch = batch || "";
      profile.bio = bio || "";
      profile.profileCompleted = !!profileCompleted;

      await profile.save();

      return res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    }

    profile = await StudentProfile.create({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      leetcodeUrl: leetcodeUrl || "",
      leetcodeUsername: leetcodeUsername || "",
      codechefUrl: codechefUrl || "",
      githubUrl: githubUrl || "",
      linkedinUrl: linkedinUrl || "",
      college: college || "",
      batch: batch || "",
      bio: bio || "",
      profileCompleted: !!profileCompleted,
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// SYNC MY LEETCODE STATS
const syncMyLeetCodeStats = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const username =
      profile.leetcodeUsername ||
      extractLeetCodeUsername(profile.leetcodeUrl);

    if (!username) {
      return res.status(400).json({
        message: "LeetCode username not found",
      });
    }

    const stats = await fetchLeetCodeStats(username);

    if (!stats.success) {
      return res.status(400).json({
        message: stats.message,
      });
    }

    profile.leetcodeUsername = stats.username;
    profile.leetcodeTotalSolved = stats.totalSolved;
    profile.leetcodeEasySolved = stats.easySolved;
    profile.leetcodeMediumSolved = stats.mediumSolved;
    profile.leetcodeHardSolved = stats.hardSolved;
    profile.lastLeetcodeSyncAt = new Date();

    await profile.save();

    res.status(200).json({
      message: "LeetCode stats synced successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL PROFILES
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await StudentProfile.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email role");

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  saveMyProfile,
  getAllProfiles,
  syncMyLeetCodeStats,
};