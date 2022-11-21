import express from "express";
import fs from "fs";

import { returnConnection } from './connectDB';

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/api/suppliers", async (req, res) => {
  const connection = await returnConnection();
  
  const [rows] = await connection.execute("SELECT * FROM suppliers");

  res.send(rows);
});

app.get("/api/suppliers/:id", async (req, res) => {
  const connection = await returnConnection();
  
  const [rows] = await connection.query("SELECT * FROM products WHERE supplierID = ?", [req.params.id]);

  res.send(rows);
});

app.post("/api/suppliers", async (req, res) => {
  const connection = await returnConnection();
  const { productCode, name, price, quantity, supplierID } = req.body;
  const [rows] = await connection.query("INSERT INTO products (productCode, name, price, quantity, supplierID) VALUES (?, ?, ?, ?, ?)", [productCode, name, price, quantity, supplierID]);
  res.send(rows);
});
  

app.get('/', (req, res) => {
  res.send(fs.readFileSync('./public/index.html', 'utf8'));
});

app.get('/add', (req, res) => {
  res.send(fs.readFileSync('./public/add.html', 'utf8'));
});

app.listen(3000, () => {
  console.log(`Server is running! http://localhost:3000`);
})