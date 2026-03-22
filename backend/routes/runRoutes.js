const express = require("express");
const router = express.Router();
const executeCode = require("../utils/executeCode");

// Run code without judging (powers the "Run" button)
router.post("/", async (req, res) => {
  const { code, input, language = "python" } = req.body;

  try {
    const result = await executeCode(code, input, language);
    res.json({
      output: result.output,
      runtime: result.runtime + " ms",
    });
  } catch (err) {
    res.status(200).json({
      output: err.message,
      type: err.type,
      runtime: (err.runtime || 0) + " ms",
    });
  }
});

module.exports = router;