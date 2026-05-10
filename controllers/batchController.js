const Batch = require("../models/Batch");


// CREATE BATCH
const createBatch = async (req, res) => {

  try {

    const {
      batchName,
      description,
      accessKey, // 🔥 NEW
    } = req.body;

    // basic validation
    if (!accessKey) {
      return res.status(400).json({
        message: "Access key is required",
      });
    }

    const batch = await Batch.create({
      batchName,
      description,
      accessKey, // 🔥 SAVE KEY
      trainer: req.user._id,
    });

    res.status(201).json({
      message: "Batch created successfully",
      batch,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// GET ALL BATCHES
const getBatches = async (req, res) => {

  try {

    const batches = await Batch.find()
      .populate("trainer", "name email");

    res.status(200).json(batches);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// DELETE BATCH
const deleteBatch = async (req, res) => {

  try {

    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        message: "Batch not found",
      });
    }

    await batch.deleteOne();

    res.status(200).json({
      message: "Batch deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


module.exports = {
  createBatch,
  getBatches,
  deleteBatch,
};