const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const languageConfig = {
  python: {
    image: "python:3.9",
    filename: "temp.py",
    runCmd: "timeout 5 python temp.py",
  },
  cpp: {
    image: "gcc:latest",
    filename: "temp.cpp",
    runCmd: "g++ temp.cpp -o temp && timeout 5 ./temp",
  },
  javascript: {
    image: "node:18",
    filename: "temp.js",
    runCmd: "timeout 5 node temp.js",
  },
  java: {
    image: "openjdk:17",
    filename: "Main.java",
    runCmd: "javac Main.java && timeout 5 java Main",
  },
};

const executeCode = (code, input, language = "python") => {
  return new Promise((resolve, reject) => {
    const config = languageConfig[language];
    if (!config) {
      return reject({ type: "RE", message: "Unsupported language" });
    }

    const filePath = path.join(__dirname, `../${config.filename}`);
    fs.writeFileSync(filePath, code);

    const dirPath = path.dirname(filePath).replace(/\\/g, "/");

    const command = `docker run --rm -i \
--memory="100m" \
--cpus="0.5" \
--network=none \
-v "${dirPath}:/app" \
-w /app \
${config.image} sh -c "${config.runCmd}"`;

    const startTime = Date.now();

    const child = exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
      const runtime = Date.now() - startTime;

      if (error) {
        if (error.killed || error.signal === "SIGTERM" || error.code === 124) {
          return reject({ type: "TLE", message: "Time Limit Exceeded", runtime });
        }
        return reject({ type: "RE", message: stderr || error.message, runtime });
      }

      resolve({ output: stdout, runtime });
    });

    if (input) child.stdin.write(input);
    child.stdin.end();
  });
};

module.exports = executeCode;