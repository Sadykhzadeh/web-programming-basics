// there are several types of modules in node
// core modules ('http', 'path', 'fs', 'os', 'util')
// local modules
// third-party modules

// http
import http from "http";
import { readFile } from "fs/promises";

const port = process.env.PORT || 5000;
// some.html is next to this file, whatever directory node is started from
const page = new URL("./some.html", import.meta.url);

http.createServer(async (req, res) => {
  try {
    const html = await readFile(page, "utf8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  } catch (error) {
    console.error(error.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Could not read the page");
  }
}).listen(port);
console.log(`http://localhost:${port}`);
