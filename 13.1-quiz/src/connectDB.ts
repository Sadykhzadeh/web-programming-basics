import mysql2 from "mysql2/promise";

// one pool for the whole app instead of a new connection per request
export const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD || "12345678",
  database: "testOne",
});
