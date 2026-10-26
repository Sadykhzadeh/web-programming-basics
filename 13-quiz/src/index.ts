// 1.	Use FS method, to pull data from external json file (500_records.json)   [ 1 ]
// 2.	Create external JavaScript module to import json object to main app file[1]
// 3.	Use higher order functions(foreach, map, filter)
// 4.	Create simple front side(form with input type number), to fetch limited number of records(1, 5, 10 or 20…)[1]
// 5.	Display results by creating simple http server in plain Node JS[1]
// 6.	Display only(name, location, profile picture, url, likes, dislikes)[1]

import http from "http";
import { getFileData } from "./dataFromJSON";
import { requestRoute } from "./requestRoute";

const server = http.createServer();

// read once, not for every request
const indexHtml = getFileData("static/index.html", false);

server.on("request", (req, res) => {
  // /request route for file data sending to client
  if (requestRoute(req, res)) return;

  // index.html for front side
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(indexHtml);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running! http://localhost:${port}`);
});
