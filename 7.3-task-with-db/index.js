import express from "express";
import { createConnection } from "mysql2/promise";

const app = express();

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
    const connection = await createConnection({
      host: "localhost",
      user: "root",
      password: process.env.DB_PASSWORD || "password",
      database: "animals",
    });

    const [rows] = await connection.execute("SELECT * FROM `animals`");
    await connection.end();
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
