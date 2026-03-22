const express = require("express");
const router = express.Router();

const { submitCode, getSubmission } = require("../controllers/submissionController");
const Submission = require("../models/Submission");

// Submit code
router.post("/", submitCode);

// Get submission result by ID
router.get("/:id", getSubmission);

// Get all submissions by a user
router.get("/user/:userId", async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .select("-code"); // hide code for list view
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all submissions by a user for a specific problem
router.get("/problem/:problemId/user/:userId", async (req, res) => {
  try {
    const submissions = await Submission.find({
      problemId: req.params.problemId,
      userId: req.params.userId,
    }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;