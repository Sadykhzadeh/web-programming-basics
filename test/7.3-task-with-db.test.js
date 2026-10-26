import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { mysqlUp, root, startServer } from "./helpers.js";

const lesson = "7.3-task-with-db";
const password = process.env.DB_PASSWORD || "password";
const skip = !(await mysqlUp()) && "no MySQL on localhost:3306";

// mysql2 is a dependency of the lesson, not of the repository root
const { createConnection } = createRequire(join(root, lesson, "/"))("mysql2/promise");
const admin = () =>
  createConnection({
    host: "localhost",
    user: "root",
    password,
    multipleStatements: true,
  });

let server;
before(async () => {
  if (skip) return;
  const db = await admin();
  await db.query("drop database if exists animals");
  await db.query(readFileSync(join(root, lesson, "random-data.sql"), "utf8"));
  await db.end();
  server = await startServer(lesson, ["index.js"], { env: { DB_PASSWORD: password } });
});
after(async () => {
  await server?.stop();
});

test("7.3-task-with-db: lists the animals from the database", { skip }, async () => {
  const res = await fetch(server.base);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /<td>Bella<\/td>/);
  assert.equal(html.match(/<td>/g).length, 20);
});

test("7.3-task-with-db: animal names are escaped", { skip }, async () => {
  const db = await admin();
  await db.query(
    "insert into animals.animals (name, age, species, description, imageURL) values (?, 1, 'cat', '', '')",
    ["<img src=x onerror=alert(1)>"],
  );
  try {
    const html = await (await fetch(server.base)).text();
    assert.ok(!html.includes("<img"));
    assert.ok(html.includes("&lt;img src=x"));
  } finally {
    await db.query("delete from animals.animals where species = 'cat'");
    await db.end();
  }
});
