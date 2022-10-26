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

const grabData = async () => {
  const response = await axios("https://jsonplaceholder.typicode.com/users");
  fs.writeFileSync("users.json", JSON.stringify(response.data, null, 2));
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

const server = http.createServer((__req, res) => {
  grabData();
  res.writeHead(200, { "Content-Type": "text/html" });
  // style table
  res.write(`<h1>Users</h1>${style}${readlTimeInput}`);
  res.write(
    "<table><tr><th>ID</th><th>Name</th><th>Username</th><th>Email</th></tr>",
  );
  // read data from JSON file
  const data = fs.readFileSync("users.json");
  const users = JSON.parse(data);
  // print data to the HTTP response
  users.forEach((user) => {
    res.write(
      `<tr><td>${user.id}</td><td>${user.name}</td><td>${user.username}</td><td>${user.email}</td></tr>`,
    );
  });
  res.write(`</table>${realTimeScript}`);
  res.end();
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
