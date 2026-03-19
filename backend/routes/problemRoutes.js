const express = require("express");
const router = express.Router();
const {
  getProblems,
  createProblem,
} = require("../controllers/problemController");

router.get("/", getProblems);
router.post("/", createProblem);

module.exports = router;