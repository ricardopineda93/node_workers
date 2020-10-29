const fs = require("fs-extra");
const { parentPort, workerData } = require("worker_threads");
const { getRandomIndex } = require("./utils");
const firstName = require("./data/first_name.json");
const middleName = require("./data/middle_name.json");
const lastName = require("./data/last_name.json");

const { namesPerThread, outputFile } = workerData;

(async () => {
  for (let i = 0; i < namesPerThread; i++) {
    const data = [firstName, middleName, lastName]
      .map(getRandomIndex)
      .concat("\n")
      .join(" ");
    await fs.appendFile(outputFile, data);

    parentPort.postMessage(data);
  }
})();
