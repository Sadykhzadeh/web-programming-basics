// there are several types of modules in node
// core modules ('http', 'path', 'fs', 'os', 'util')
// local modules
// third-party modules

// http
import http from "http";
import { readFileSync } from "fs";

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(readFileSync("./some.html", "utf8"));
  res.end();
}).listen(5000);
console.log("http://localhost:5000");
