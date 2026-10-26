import express from "express";
import path from "path";

import { pool } from './connectDB';

const app = express();
// the public folder is next to src and dist, wherever the server is started from
const publicDir = path.join(__dirname, "..", "public");
app.use(express.json());
// also serves public/index.html for /
app.use(express.static(publicDir));

// report a failed query instead of crashing the process
const handle = (fn) => (req, res) =>
  fn(req, res).catch((error) => {
    console.error(error.message);
    res.status(500).send({ message: "Database error" });
  });

app.get("/api/suppliers", handle(async (req, res) => {
  const [rows] = await pool.execute("SELECT * FROM suppliers");

  res.send(rows);
}));

app.get("/api/suppliers/:id", handle(async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM products WHERE supplierID = ?", [req.params.id]);

  res.send(rows);
}));

app.post("/api/suppliers", handle(async (req, res) => {
  const { productCode, name, price, quantity, supplierID } = req.body;

  // Number(null) and Number([]) are 0, so only a number or a non-empty string
  // counts as a value
  const given = (value) =>
    (typeof value === "string" || typeof value === "number") && value !== "";

  // all fields are required (see task.txt), match the column types of db.sql
  const valid =
    typeof productCode === "string" && productCode.length === 3 &&
    typeof name === "string" && name.trim() !== "" && name.length <= 30 &&
    given(price) && Number(price) >= 0 && Number(price) < 100000 &&
    given(quantity) && Number.isInteger(Number(quantity)) && Number(quantity) >= 0 &&
    given(supplierID) && Number.isInteger(Number(supplierID)) && Number(supplierID) > 0;
  if (!valid) {
    res.status(400).send({ message: "All fields should be filled out!" });
    return;
  }

  const [rows] = await pool.query("INSERT INTO products (productCode, name, price, quantity, supplierID) VALUES (?, ?, ?, ?, ?)", [productCode, name, price, quantity, supplierID]);
  res.send(rows);
}));

app.get('/add', (req, res) => {
  res.sendFile(path.join(publicDir, 'add.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running! http://localhost:${port}`);
})