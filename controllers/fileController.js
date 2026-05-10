const File = require("../models/File");


// CREATE FILE
const createFile = async (req, res) => {

  try {

    const {
      fileName,
      language,
      topicId,
    } = req.body;

    const file = await File.create({
      fileName,
      language,
      topic: topicId,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "File created successfully",
      file,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// GET FILES BY TOPIC
const getFilesByTopic = async (req, res) => {

  try {

    const files = await File.find({
      topic: req.params.topicId,
    });

    res.status(200).json(files);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// GET SINGLE FILE
const getSingleFile = async (req, res) => {

  try {

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    res.status(200).json(file);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// UPDATE CODE
const updateCode = async (req, res) => {

  try {

    const { code } = req.body;

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    file.code = code;

    await file.save();

    res.status(200).json({
      message: "Code updated successfully",
      file,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// DELETE FILE
const deleteFile = async (req, res) => {

  try {

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    await file.deleteOne();

    res.status(200).json({
      message: "File deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


module.exports = {
  createFile,
  getFilesByTopic,
  getSingleFile,
  updateCode,
  deleteFile,
};