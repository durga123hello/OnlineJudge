const submissionQueue = require("../queues/submissionQueue");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const executeCode = require("../utils/executeCode");

const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Worker DB connected"))
  .catch(err => console.error("DB error:", err));

console.log("Worker started...");

submissionQueue.process(5, async (job) => {
  console.log("=== Processing job:", job.id, "===");

  // ✅ Added language
  const { submissionId, code, problemId, language } = job.data;

  try {
    const problem = await Problem.findById(problemId);

    if (!problem) {
      await Submission.findByIdAndUpdate(submissionId, {
        status: "Error",
        output: "Problem not found",
      });
      return;
    }

    let allPassed = true;
    let failedCase = null;
    let finalOutput = "";
    let totalRuntime = 0;

    for (let i = 0; i < problem.testCases.length; i++) {
      const test = problem.testCases[i];

      console.log("Running test case:", i + 1);

      try {
        // ✅ Passing language to executeCode
        const result = await executeCode(code, test.input, language);

        const output = result.output;
        const runtime = result.runtime;

        totalRuntime += runtime;
        finalOutput = output;

        const normalize = (str) =>
          str.trim().replace(/\r\n/g, "\n").replace(/\n+$/, "");

        if (normalize(output) !== normalize(test.output)) {
          allPassed = false;
          failedCase = {
            testCase: i + 1,
            expected: test.output,
            got: output,
          };
          break;
        }

      } catch (err) {
        console.log("Execution error:", err);

        if (err.type === "TLE") {
          await Submission.findByIdAndUpdate(submissionId, {
            status: "Time Limit Exceeded",
            output: err.message,
            runtime: err.runtime + " ms",
          });
        } else {
          await Submission.findByIdAndUpdate(submissionId, {
            status: "Error",
            output: err.message,
            runtime: err.runtime + " ms",
          });
        }
        return;
      }
    }

    const finalStatus = allPassed ? "Accepted" : "Wrong Answer";

    await Submission.findByIdAndUpdate(submissionId, {
      status: finalStatus,
      output: finalOutput,
      failedCase: failedCase,
      runtime: totalRuntime + " ms",
    });

    console.log("Submission updated:", finalStatus);

  } catch (err) {
    console.log("Worker error:", err);

    await Submission.findByIdAndUpdate(submissionId, {
      status: "Error",
      output: err.message,
    });
  }
});