const fs = require("fs-extra");
const { getRandomIndex } = require("./utils");
const firstName = require("./data/first_name.json");
const middleName = require("./data/middle_name.json");
const lastName = require("./data/last_name.json");

const limit = 100000;
const outputFile = `${__dirname}/output/st-${Math.floor(
  Math.random() * 100000
)}.txt`;

(async () => {
  console.log("Initializing random names generation...");
  const startTime = Date.now();

  for (let i = 0; i < limit; i++) {
    if (i % 1000 === 0) console.log(`Generated ${i} random names...`);

    const data = [firstName, middleName, lastName]
      .map(getRandomIndex)
      .concat("\n")
      .join(" ");
    await fs.appendFile(outputFile, data);
  }
  console.log(`Done! Runtime was ${Date.now() - startTime}ms.`);
})();
