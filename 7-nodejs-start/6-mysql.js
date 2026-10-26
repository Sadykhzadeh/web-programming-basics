import mysql from "mysql2";

// to connect to mysql database you need to add access credentials
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD || "password",
});

// every query reports its error here instead of ignoring it
const check = (err) => {
  if (err) throw err;
};

con.connect(function (err) {
  check(err);
  console.log("Connected!");
  con.query("create database if not exists mydb", check);
  con.query("use mydb", check);
  con.query(
    "create table if not exists customers (name VARCHAR(255), address VARCHAR(255))",
    check,
  );
  con.query(
    "insert into customers (name, address) VALUES ('Company Inc', 'Highway 37')",
    check,
  );
  con.query("select * from customers", (err, result, fields) => {
    check(err);
    console.log(result);
    // without this the open connection keeps the script running
    con.end();
  });
});
