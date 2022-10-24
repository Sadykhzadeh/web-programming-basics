import fs from "fs";

// fs.readFile("./for-fs.txt", (err, data) => {
//   if (err) throw err;
//   console.log(data.toString());
// });
console.log(fs.readFileSync("./for-fs.txt", "utf-8"));

const data = "\nHere is some data to write to the file.";
fs.appendFileSync("./for-fs.txt", data);

const JSONdata = JSON.parse(fs.readFileSync("./for-fs.json", "utf8"));

// read JSON
(() => {
  console.table(JSONdata.people[0]);
})();

// write JSON
(() => {
  JSONdata.people.push({ name: "John", age: 40 });
  fs.writeFileSync("./for-fs.json", JSON.stringify(JSONdata, null, 2));
  // write to new FILE
  fs.writeFileSync("./for-fs-new.json", JSON.stringify(JSONdata, null, 2));
})();
