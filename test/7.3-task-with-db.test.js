import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { noMysql, root, startServer } from "./helpers.js";

const lesson = "7.3-task-with-db";
const password = process.env.DB_PASSWORD || "password";
const skip = await noMysql();

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
  assert.match(html, /^<!DOCTYPE html>\s*<html lang="en">/);
  assert.match(html, /<title>Animals<\/title>/);
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

test("7.3-task-with-db: a failed query answers 500 and does not leave connections open", { skip }, async () => {
  const db = await admin();
  const open = async () => {
    const [[row]] = await db.query("show status like 'Threads_connected'");
    return Number(row.Value);
  };
  await db.query("rename table animals.animals to animals.animals_gone");
  try {
    const before = await open();
    for (let i = 0; i < 5; i++) {
      const res = await fetch(server.base);
      assert.equal(res.status, 500);
      assert.equal(await res.text(), "Database error");
    }
    assert.ok((await open()) <= before + 1, "connections were left open");
  } finally {
    await db.query("rename table animals.animals_gone to animals.animals");
    await db.end();
  }
});

// runs everywhere, the other tests need a database
test("7.3-task-with-db: without a usable database the page answers 500", async () => {
  const lonely = await startServer(lesson, ["index.js"], {
    env: { DB_PASSWORD: "not-the-password" },
  });
  try {
    const res = await fetch(lonely.base);
    assert.equal(res.status, 500);
    assert.equal(await res.text(), "Database error");
  } finally {
    await lonely.stop();
  }
});
