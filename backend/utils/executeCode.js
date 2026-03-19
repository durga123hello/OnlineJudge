const { exec } = require("child_process");
const fs = require("fs");

const executeCode = (code, input) => {
  return new Promise((resolve, reject) => {
    const file = "temp.py";

    fs.writeFileSync(file, code);

    const process = exec(
      `python ${file}`,
      { timeout: 2000 },
      (error, stdout, stderr) => {
        if (error) {
          if (error.killed) {
            return reject("Time Limit Exceeded");
          }
          return reject(stderr || error.message);
        }
        resolve(stdout);
      }
    );

    process.stdin.write(input);
    process.stdin.end();
  });
};

module.exports = executeCode;