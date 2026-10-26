import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { build, noMysql, root, startServer } from "./helpers.js";

const lesson = "13.1-quiz";
const password = process.env.DB_PASSWORD || "12345678";
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
  await db.query("drop database if exists testOne");
  await db.query(readFileSync(join(root, lesson, "db.sql"), "utf8"));
  await db.end();
  await build(lesson);
  // from the repository root on purpose: pages are found next to the code
  server = await startServer(lesson, [`${lesson}/dist/index.js`], {
    cwd: ".",
    env: { DB_PASSWORD: password },
  });
});
after(async () => {
  await server?.stop();
});

const json = (path, init) =>
  fetch(server.base + path, init).then(async (res) => ({ res, body: await res.json() }));
const post = (body) =>
  json("/api/suppliers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
const product = {
  productCode: "TST",
  name: "Test product",
  price: "2.50",
  quantity: "3",
  supplierID: "1",
};

test("13.1-quiz: lists suppliers and the products of one supplier", { skip }, async () => {
  const suppliers = await json("/api/suppliers");
  assert.equal(suppliers.res.status, 200);
  assert.equal(suppliers.body.length, 4);

  const products = await json("/api/suppliers/1");
  assert.equal(products.body.length, 5);
  assert.ok(products.body.every((p) => p.supplierID === 1));
});

test("13.1-quiz: serves the list page and the add page", { skip }, async () => {
  const home = await fetch(server.base);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /<h1>Suppliers<\/h1>/);

  const add = await fetch(server.base + "/add");
  assert.equal(add.status, 200);
  assert.match(await add.text(), /id="productCode"/);
});

test("13.1-quiz: adds a product and rejects incomplete ones", { skip }, async () => {
  const db = await admin();
  try {
    const added = await post(product);
    assert.equal(added.res.status, 201);
    const [rows] = await db.query("select * from testOne.products where productCode = 'TST'");
    assert.equal(rows.length, 1);

    for (const bad of [
      { ...product, name: "" },
      { ...product, price: "" },
      { ...product, quantity: "1.5" },
      { ...product, productCode: "TOOLONG" },
      { ...product, price: null },
      { ...product, quantity: [] },
      { ...product, supplierID: null },
    ]) {
      const { res, body } = await post(bad);
      assert.equal(res.status, 400, JSON.stringify(bad));
      assert.match(body.message, /filled out/);
    }
    const [after] = await db.query("select * from testOne.products where productCode = 'TST'");
    assert.equal(after.length, 1);
  } finally {
    await db.query("delete from testOne.products where productCode = 'TST'");
    await db.end();
  }
});

test("13.1-quiz: a supplier that does not exist is a 400, not a server error", { skip }, async () => {
  const { res, body } = await post({ ...product, supplierID: "999" });
  assert.equal(res.status, 400);
  assert.match(body.message, /supplier/i);
});

// runs everywhere, the other tests need a database
test("13.1-quiz: pages load and the API answers 500 without a usable database", async () => {
  await build(lesson);
  const lonely = await startServer(lesson, ["dist/index.js"], {
    env: { DB_PASSWORD: "not-the-password" },
  });
  try {
    for (const path of ["/", "/add"]) {
      assert.equal((await fetch(lonely.base + path)).status, 200, path);
    }
    const api = await fetch(lonely.base + "/api/suppliers");
    assert.equal(api.status, 500);
    assert.deepEqual(await api.json(), { message: "Database error" });
  } finally {
    await lonely.stop();
  }
});
