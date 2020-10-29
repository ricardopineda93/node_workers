const { Worker, isMainThread } = require("worker_threads");
const logUpdate = require("log-update");

const limit = 10000;
const numOfThreads = 10;

const namesPerThread = limit / numOfThreads;
const outputFile = `${__dirname}/output/mt-${Math.floor(
  Math.random() * 100000
)}.txt`;

const threadPool = [...Array(numOfThreads)].fill(0);

function handleMessage(_, index) {
  threadPool[index++];
  logUpdate(
    threadPool.map((status, idx) => `Thread ${idx}: ${status}`).join("\n")
  );
}

const startTime = Date.now();

if (isMainThread) {
  console.log(
    `Inside main thread, initializing attempt to generate ${limit} random names using ${numOfThreads} threads...`
  );
  for (let i = 0; i < numOfThreads; i++) {
    const port = new Worker("./worker.js", {
      workerData: { namesPerThread, outputFile, threadNumber: i + 1 },
    });

    port.on("message", (data) => handleMessage(data, i));
    port.on("error", (error) => console.error(error));
    port.on("exit", () =>
      console.log(
        `Thread ${i} process finished after ${Date.now() - startTime} ms.`
      )
    );
  }
}
