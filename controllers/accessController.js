const Batch = require("../models/Batch");

// VERIFY ACCESS KEY
const verifyBatchAccess = async (req, res) => {
  try {
    const { batchId, accessKey } = req.body;

    const batch = await Batch.findById(batchId);

    if (!batch) {
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    if (batch.accessKey !== accessKey) {
      return res.status(401).json({
        message: "Invalid access key",
      });
    }

    res.json({
      success: true,
      message: "Access granted",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  verifyBatchAccess,
};