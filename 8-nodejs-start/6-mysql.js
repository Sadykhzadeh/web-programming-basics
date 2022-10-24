import mysql from "mysql";

// to connect to mysql database you need to add access credentials
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("create database mydb", () => {});
  con.query("use mydb", () => {});
  con.query(
    "create table customers (name VARCHAR(255), address VARCHAR(255))",
    () => {},
  );
  con.query(
    "insert into customers (name, address) VALUES ('Company Inc', 'Highway 37')",
    () => {},
  );
  con.query("select * from customers", (err, result, fields) => {
    if (err) throw err;
    console.log(result);
  });
});
