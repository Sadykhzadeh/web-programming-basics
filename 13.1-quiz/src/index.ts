import express, { NextFunction, Request, Response } from "express";
import path from "path";

import { pool } from './connectDB';

const app = express();
// the public folder is next to src and dist, wherever the server is started from
const publicDir = path.join(__dirname, "..", "public");
app.use(express.json());
// also serves public/index.html for /
app.use(express.static(publicDir));

app.get("/api/suppliers", async (req: Request, res: Response) => {
  const [rows] = await pool.execute("SELECT * FROM suppliers");

  res.send(rows);
});

app.get("/api/suppliers/:id", async (req: Request, res: Response) => {
  const [rows] = await pool.query("SELECT * FROM products WHERE supplierID = ?", [req.params.id]);

  res.send(rows);
});

app.post("/api/suppliers", async (req: Request, res: Response) => {
  const { productCode, name, price, quantity, supplierID } = req.body;

  // Number(null) and Number([]) are 0, so only a number or a non-empty string
  // counts as a value
  const given = (value: unknown) =>
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

  try {
    const [rows] = await pool.query("INSERT INTO products (productCode, name, price, quantity, supplierID) VALUES (?, ?, ?, ?, ?)", [productCode, name, price, quantity, supplierID]);
    res.status(201).send(rows);
  } catch (error) {
    // the foreign key to suppliers failed: the client sent a bad supplier
    if ((error as { code?: string }).code === "ER_NO_REFERENCED_ROW_2") {
      res.status(400).send({ message: "Unknown supplier" });
      return;
    }
    throw error;
  }
});

app.get('/add', (req, res) => {
  res.sendFile(path.join(publicDir, 'add.html'));
});

// Express 5 passes errors thrown (or rejected) in a handler here, so the routes
// need no try/catch of their own. Without it the default handler would send the
// stack trace to the client.
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  // body-parser and friends set a status like 400 for a bad request
  const status = error.status >= 400 && error.status < 500 ? error.status : 500;
  if (status === 500) console.error(error.message);
  res.status(status).send({
    message: status === 500 ? "Server error" : "Bad request",
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running! http://localhost:${port}`);
})