const Topic = require("../models/Topic");


// CREATE TOPIC
const createTopic = async (req, res) => {

  try {

    const { topicName, batchId } = req.body;

    const topic = await Topic.create({
      topicName,
      batch: batchId,
    });

    res.status(201).json({
      message: "Topic created successfully",
      topic,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// GET TOPICS BY BATCH
const getTopicsByBatch = async (req, res) => {

  try {

    const topics = await Topic.find({
      batch: req.params.batchId,
    });

    res.status(200).json(topics);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// DELETE TOPIC
const deleteTopic = async (req, res) => {

  try {

    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    await topic.deleteOne();

    res.status(200).json({
      message: "Topic deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


module.exports = {
  createTopic,
  getTopicsByBatch,
  deleteTopic,
};