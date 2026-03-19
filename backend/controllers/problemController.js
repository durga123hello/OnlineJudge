const Problem = require("../models/Problem");

// GET all problems
exports.getProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE problem
exports.createProblem = async (req, res) => {
  try {
    const problem = await Problem.create(req.body);
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};