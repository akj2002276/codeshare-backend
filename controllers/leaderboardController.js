const StudentProfile = require("../models/StudentProfile");

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
        "name email college batch leetcodeUsername leetcodeTotalSolved leetcodeEasySolved leetcodeMediumSolved leetcodeHardSolved githubUrl linkedinUrl"
      );

    const rankedLeaderboard = leaderboard.map(
      (profile, index) => ({
        rank: index + 1,
        ...profile.toObject(),
      })
    );

    res.status(200).json(rankedLeaderboard);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getLeaderboard,
};