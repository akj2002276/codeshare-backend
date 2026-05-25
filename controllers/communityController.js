const CommunityMember = require("../models/CommunityMember");
const CommunityMessage = require("../models/CommunityMessage");

// JOIN COMMUNITY
const joinCommunity = async (req, res) => {
  try {
    let member = await CommunityMember.findOne({
      user: req.user._id,
    });

    if (member) {
      return res.status(200).json({
        message: "Already joined community",
        member,
      });
    }

    member = await CommunityMember.create({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });

    res.status(201).json({
      message: "Joined community successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET MY COMMUNITY STATUS
const getMyCommunityStatus = async (req, res) => {
  try {
    const member = await CommunityMember.findOne({
      user: req.user._id,
    });

    res.status(200).json({
      joined: !!member,
      member,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL MEMBERS - TRAINER
const getCommunityMembers = async (req, res) => {
  try {
    const members = await CommunityMember.find()
      .sort({ joinedAt: -1 })
      .populate("user", "name email role");

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET MESSAGES
const getMessages = async (req, res) => {
  try {
    const messages = await CommunityMessage.find()
      .sort({ createdAt: 1 })
      .limit(200);

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const member = await CommunityMember.findOne({
      user: req.user._id,
    });

    if (!member) {
      return res.status(403).json({
        message: "Please join community first",
      });
    }

    if (member.isBlocked) {
      return res.status(403).json({
        message: "You are blocked from sending messages",
        blockReason: member.blockReason,
      });
    }

    const newMessage = await CommunityMessage.create({
      sender: req.user._id,
      senderName: req.user.name,
      senderEmail: req.user.email,
      senderRole: req.user.role,
      message: message.trim(),
    });

    res.status(201).json({
      message: "Message sent successfully",
      communityMessage: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// BLOCK MEMBER - TRAINER
const blockMember = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        message: "Block reason is required",
      });
    }

    const member = await CommunityMember.findOne({
      user: req.params.studentId,
    });

    if (!member) {
      return res.status(404).json({
        message: "Community member not found",
      });
    }

    member.isBlocked = true;
    member.blockReason = reason.trim();
    member.blockedAt = new Date();

    await member.save();

    res.status(200).json({
      message: "Member blocked successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UNBLOCK MEMBER - TRAINER
const unblockMember = async (req, res) => {
  try {
    const member = await CommunityMember.findOne({
      user: req.params.studentId,
    });

    if (!member) {
      return res.status(404).json({
        message: "Community member not found",
      });
    }

    member.isBlocked = false;
    member.blockReason = "";
    member.blockedAt = null;

    await member.save();

    res.status(200).json({
      message: "Member unblocked successfully",
      member,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// DELETE SINGLE MESSAGE - TRAINER
const deleteMessage = async (req, res) => {
  try {
    const message = await CommunityMessage.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    await message.deleteOne();

    res.status(200).json({
      message: "Message deleted successfully",
      messageId: req.params.messageId,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CLEAR ALL MESSAGES - TRAINER
const clearAllMessages = async (req, res) => {
  try {
    await CommunityMessage.deleteMany({});

    res.status(200).json({
      message: "Community chat cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  joinCommunity,
  getMyCommunityStatus,
  getCommunityMembers,
  getMessages,
  sendMessage,
  blockMember,
  unblockMember,
  deleteMessage,
  clearAllMessages,
};