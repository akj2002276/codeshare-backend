const StudentProfile = require("../models/StudentProfile");

const {
  fetchLeetCodeStats,
  extractLeetCodeUsername,
} = require("../utils/leetcodeService");

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await StudentProfile.find({
      profileCompleted: true,
    })
      .sort({
        leetcodeTotalSolved: -1,
        leetcodeHardSolved: -1,
        leetcodeMediumSolved: -1,
      })
      .select(
        "name email college batch leetcodeUsername leetcodeUrl githubUrl linkedinUrl leetcodeTotalSolved leetcodeEasySolved leetcodeMediumSolved leetcodeHardSolved lastLeetcodeSyncAt"
      );

    const rankedLeaderboard = leaderboard.map((profile, index) => ({
      rank: index + 1,
      ...profile.toObject(),
    }));

    res.status(200).json(rankedLeaderboard);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// TRAINER ONLY - SYNC ALL STUDENTS LEETCODE STATS
const syncAllLeaderboard = async (req, res) => {
  try {
    const profiles = await StudentProfile.find({
      profileCompleted: true,
      leetcodeUrl: { $ne: "" },
    });

    let updated = 0;
    let failed = 0;
    const failedProfiles = [];

    for (const profile of profiles) {
      try {
        const username =
          profile.leetcodeUsername ||
          extractLeetCodeUsername(profile.leetcodeUrl);

        if (!username) {
          failed++;
          failedProfiles.push({
            name: profile.name,
            email: profile.email,
            reason: "LeetCode username missing",
          });
          continue;
        }

        const stats = await fetchLeetCodeStats(username);

        if (!stats.success) {
          failed++;
          failedProfiles.push({
            name: profile.name,
            email: profile.email,
            reason: stats.message,
          });
          continue;
        }

        profile.leetcodeUsername = stats.username;
        profile.leetcodeTotalSolved = stats.totalSolved;
        profile.leetcodeEasySolved = stats.easySolved;
        profile.leetcodeMediumSolved = stats.mediumSolved;
        profile.leetcodeHardSolved = stats.hardSolved;
        profile.lastLeetcodeSyncAt = new Date();

        await profile.save();

        updated++;
      } catch (error) {
        failed++;

        failedProfiles.push({
          name: profile.name,
          email: profile.email,
          reason: error.message,
        });
      }
    }

    res.status(200).json({
      message: "Leaderboard sync completed",
      totalProfiles: profiles.length,
      updated,
      failed,
      failedProfiles,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getLeaderboard,
  syncAllLeaderboard,
};