import express from "express";
import { createPool } from "mysql2/promise";

const app = express();

// one pool for the whole app: a connection is opened once and reused, instead
// of a new login for every request
const pool = createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD || "password",
  database: "animals",
});

// values from the database go into HTML, so they have to be escaped
const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

app.get("/", async (__req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM `animals`");
    const animals = rows.map((row) => row.name);

    res.send(`
      <table>
        <tr>
          <th>Animal</th>
        </tr>
        ${
      animals.map((animal) => `
          <tr>
            <td>${escapeHtml(animal)}</td>
          </tr>
        `).join("")
    }
      </table>
    `);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Database error");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
