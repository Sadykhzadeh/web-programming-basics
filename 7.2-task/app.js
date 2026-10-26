/**
 * TASK: use axios
 * - grab the data from the API (users from placeholder.com)
 * - save data into JSON file
 * - read the data from the JSON file
 * - print the data to the HTTP response (HTML-style)
 * (Optional I did styles and real-time search)
 */

import http from "http";
import fs from "fs";
import axios from "axios";

// the API address and the port can be overridden, handy for trying it offline
const usersUrl = process.env.USERS_URL ||
  "https://jsonplaceholder.typicode.com/users";

const grabData = async () => {
  const response = await axios(usersUrl);
  fs.writeFileSync(
    "users.json",
    JSON.stringify(response.data, null, 2) + "\n",
  );
};

const style = `<style>
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          text-align: left;
          padding: 8px;
        }
        tr:nth-child(even) {background-color: #f2f2f2;}

        input[type=text] {
          width: 100%;
          padding: 12px 20px;
          margin: 8px 0;
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
      </style>`;

const readlTimeInput =
  `<input type="text" id="search" onkeyup="search()" placeholder="Search realtime for names...">`;
const realTimeScript = `<script>
        function search() {
          let input = document.getElementById('search').value;
          let x = document.getElementsByTagName('tr');
          for (i = 0; i < x.length; i++) {
            if (!x[i].innerHTML.toLowerCase().includes(input.toLowerCase())) {
              x[i].style.display = 'none';
            } else {
              x[i].style.display = '';
            }
          }
        }
      </script>`;

// API data ends up in HTML, so escape it
const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const server = http.createServer(async (req, res) => {
  // browsers also ask for /favicon.ico, which must not start another download
  if (req.url !== "/") {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
    return;
  }
  // wait for the file to be written before reading it back
  try {
    await grabData();
  } catch (error) {
    console.error(error.message);
  }
  // read data from JSON file, before anything is sent so a failure can still
  // be answered with an error status
  let users;
  try {
    users = JSON.parse(await fs.promises.readFile("users.json"));
  } catch (error) {
    console.error(error.message);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Could not read the users");
    return;
  }
  res.writeHead(200, { "Content-Type": "text/html" });
  // style table
  res.write(`<h1>Users</h1>${style}${readlTimeInput}`);
  res.write(
    "<table><tr><th>ID</th><th>Name</th><th>Username</th><th>Email</th></tr>",
  );
  // print data to the HTTP response
  users.forEach((user) => {
    res.write(
      `<tr><td>${escapeHtml(user.id)}</td><td>${escapeHtml(user.name)}</td><td>${escapeHtml(user.username)}</td><td>${escapeHtml(user.email)}</td></tr>`,
    );
  });
  res.write(`</table>${realTimeScript}`);
  res.end();
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
