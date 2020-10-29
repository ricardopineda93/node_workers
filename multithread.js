#!/usr/bin/env node

// Handles command line arguments
const yargs = require("yargs/yargs");
const argv = yargs(process.argv.slice(2)).options({
  t: { type: "number", alias: "threads", default: 4 },
  l: { type: "number", alias: "limit", default: 1000 },
}).argv;

const { Worker, isMainThread } = require("worker_threads");
const logUpdate = require("log-update");

const numOfThreads = argv.t;
const limit = argv.l;
const namesPerThread = limit / numOfThreads;
const outputFile = `${__dirname}/output/mt-${Math.floor(
  Math.random() * 100000
)}.txt`;

// An array where each positional element tracks the number of names it's index-respective thread has computed,
// e.g namesGeneratedByEachThread[0] represents thread 1's number of computed names
const namesGeneratedByEachThread = [...Array(numOfThreads)].fill(0);

// A function that will handle keeping track of the number of names computed by each thread, is invoked
// on each message sent by a worker thread
function handleMessage(_, index) {
  // Indexes into the proper position of the namesGeneratedByEachThread array, increments that number
  namesGeneratedByEachThread[index]++;
  // Logs update "in place"
  logUpdate(
    namesGeneratedByEachThread
      .map(
        (numberOfNamesFromThisThread, idx) =>
          `Thread ${idx}: ${numberOfNamesFromThisThread}`
      )
      .join("\n")
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
