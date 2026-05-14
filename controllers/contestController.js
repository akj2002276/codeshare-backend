const Contest = require("../models/Contest");

// CREATE CONTEST
const createContest = async (req, res) => {
  try {
    const {
      contestName,
      batchName,
      platform,
      contestLink,
      contestDate,
      contestTime,
    } = req.body;

    if (
      !contestName ||
      !batchName ||
      !platform ||
      !contestLink ||
      !contestDate ||
      !contestTime
    ) {
      return res.status(400).json({
        message: "Please fill all contest fields",
      });
    }

    const contest = await Contest.create({
      contestName,
      batchName,
      platform,
      contestLink,
      contestDate,
      contestTime,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Contest added successfully",
      contest,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL CONTESTS
const getContests = async (req, res) => {
  try {
    const contests = await Contest.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.status(200).json(contests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE CONTEST
const deleteContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    await contest.deleteOne();

    res.status(200).json({
      message: "Contest deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createContest,
  getContests,
  deleteContest,
};