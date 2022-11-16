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

// make /request route for file data sending to client
server.on("request", requestRoute);

// index.html for front side
server.on("request", (req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(getFileData("static/index.html", false));
  }
  res.end();
});

server.listen(3000, () => {
  console.log(`Server is running! http://localhost:3000`);
});
