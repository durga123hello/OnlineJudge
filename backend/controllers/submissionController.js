const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const executeCode = require("../utils/executeCode");

exports.submitCode = async (req, res) => {
  try {
    const { userId, problemId, code } = req.body;

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    let allPassed = true;
    let failedCase = null;
    let finalOutput = "";

    
    for (let i = 0; i < problem.testCases.length; i++) {
      const test = problem.testCases[i];

      try {
        const result = await executeCode(code, test.input);

        // store last output
        finalOutput = result;

        if (result.trim() !== test.output.trim()) {
          allPassed = false;

          failedCase = {
            testCase: i + 1,
            expected: test.output,
            got: result,
          };

          break;
        }

      } catch (err) {
        return res.json({
          status: "Error",
          output: err,
        });
      }
    }

    
    const submission = await Submission.create({
      userId,
      problemId,
      code,
      status: allPassed ? "Accepted" : "Wrong Answer",
      output: finalOutput,
    });
    console.log("Sending response:", {
  status: submission.status,
  failedCase,
});
    
    res.json({
      status: submission.status,
      failedCase,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};