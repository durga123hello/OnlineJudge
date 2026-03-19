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
  status: {
    type: String,
    enum: ["Accepted", "Wrong Answer", "Error"],
  },
  output: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);