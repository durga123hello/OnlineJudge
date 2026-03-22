const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
  },
  code: {
    type: String,
  },
  language: {
    type: String,
    enum: ["python", "cpp", "javascript", "java"],
    default: "python",
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Accepted", "Wrong Answer", "Time Limit Exceeded", "Error"],
    default: "Pending",
  },
  output: {
    type: String,
  },
  runtime: {
    type: String,
  },
  failedCase: {
    type: Object,
  },
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);