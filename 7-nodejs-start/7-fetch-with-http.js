// basic fetching from API
import https from "https";

const url = "https://jsonplaceholder.typicode.com/posts/2";

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Request failed with status ${res.statusCode}`);
    process.exitCode = 1;
    // read and drop the body so the connection is released
    res.resume();
    return;
  }
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log(JSON.parse(data));
  });
}).on("error", (error) => {
  // no network, unknown host, ...: without a listener this event would throw
  console.error(`Request failed: ${error.message}`);
  process.exitCode = 1;
});
