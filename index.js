const { chain } = require("stream-chain");
const { parser } = require("stream-json");
const { streamValues } = require("stream-json/streamers/StreamValues");
const fs = require("fs");

const formatEntry = ({ Properties }) => {
  const formatted = {};
  for (const property of Properties) {
    const [[fieldName, fieldValue]] = Object.entries(property);
    if (Array.isArray(fieldValue)) {
      formatted[fieldName] = fieldValue.join(",");
    } else {
      formatted[fieldName] = fieldValue;
    }
  }
  return formatted;
};
const main = () => {
  const fileName = process.argv[2];

  if (!fileName) {
    console.error("No filename specified");
    return;
  }
  chain([
    fs.createReadStream(fileName),
    parser(),
    streamValues(),
    (data) => {
      //value[0] is disclaimer entry
      const usefulData = data.value[1];

      const results = [];
      for (const entry of usefulData) {
        results.push(formatEntry(entry));
      }

      fs.writeFileSync("results.json", JSON.stringify(results));
      console.log("Successfully wrote results to results.json");
    },
  ]);
};

main();
