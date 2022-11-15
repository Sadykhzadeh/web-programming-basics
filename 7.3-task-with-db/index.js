import express from "express";
import { createConnection } from "mysql2/promise";

const app = express();

app.get("/", async (__req, res) => {
  const connection = await createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "Animals",
  });

  const [rows] = await connection.execute("SELECT * FROM `Animals`");
  const animals = rows.map((row) => row.name);

  res.send(`
    <table>
      <tr>
        <th>Animal</th>
      </tr>
      ${
    animals.map((animal) => `
        <tr>
          <td>${animal}</td>
        </tr>
      `).join("")
  }
    </table>
  `);
});

app.listen(3000, () => console.log("Server is running on port 3000"));
