const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const submissionQueue = require("../queues/submissionQueue");

exports.submitCode = async (req, res) => {
  try {
    const { userId, problemId, code } = req.body;

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const submission = await Submission.create({
      userId,
      problemId,
      code,
      status: "Pending",
      output: "",
    });

    const job = await submissionQueue.add({
      submissionId: submission._id,
      code,
      problemId,
      userId,
    });

    submission.jobId = job.id;
    await submission.save();

    res.json({
      status: "Processing",
      jobId: job.id,
      submissionId: submission._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(submission);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};