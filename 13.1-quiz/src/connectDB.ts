import mysql2 from "mysql2/promise";

export const returnConnection = async() => {
  const connection = await mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "testOne",
  });
  connection.connect();
  return connection;
};
