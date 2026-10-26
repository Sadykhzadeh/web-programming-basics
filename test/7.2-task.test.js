import { after, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { once } from "node:events";
import { join } from "node:path";
import { root, startServer } from "./helpers.js";

const lesson = "7.2-task";
const usersFile = join(root, lesson, "users.json");
const original = readFileSync(usersFile, "utf8");
const users = JSON.parse(original);

// stands in for jsonplaceholder, so the test needs no internet and counts calls
let apiCalls = 0;
let apiUsers = users;
let apiStatus = 200;
const api = createServer((req, res) => {
  apiCalls++;
  res.statusCode = apiStatus;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(apiUsers));
});
let server;

before(async () => {
  api.listen(0, "127.0.0.1");
  await once(api, "listening");
  const usersUrl = `http://127.0.0.1:${api.address().port}/users`;
  server = await startServer(lesson, ["app.js"], { env: { USERS_URL: usersUrl } });
});
// the lesson overwrites users.json on every request, put the real one back
const restore = () => {
  writeFileSync(usersFile, original);
  apiCalls = 0;
  apiUsers = users;
  apiStatus = 200;
};
beforeEach(restore);
after(async () => {
  await server.stop();
  api.close();
  restore();
});

test("7.2-task: the page lists the users the API returned", async () => {
  const res = await fetch(server.base);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /<h1>Users<\/h1>/);
  assert.ok(html.includes(users[0].email));
  assert.equal(html.match(/<tr><td>/g).length, users.length);
});

test("7.2-task: API text is escaped", async () => {
  apiUsers = [{ ...users[0], name: "<img src=x onerror=alert(1)>" }];
  const html = await (await fetch(server.base)).text();
  assert.ok(!html.includes("<img"));
  assert.ok(html.includes("&lt;img src=x"));
});

test("7.2-task: only the front page triggers a download", async () => {
  const res = await fetch(server.base + "/favicon.ico");
  assert.equal(res.status, 404);
  assert.equal(apiCalls, 0);

  await fetch(server.base);
  assert.equal(apiCalls, 1);
});

test("7.2-task: a failing API falls back to the saved users", async () => {
  apiStatus = 500;
  const res = await fetch(server.base);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.equal(html.match(/<tr><td>/g).length, users.length);
});

test("7.2-task: a broken users.json answers 500 and the server keeps running", async () => {
  apiStatus = 500;
  writeFileSync(usersFile, "{ not json");
  const broken = await fetch(server.base);
  assert.equal(broken.status, 500);

  writeFileSync(usersFile, original);
  assert.equal((await fetch(server.base)).status, 200);
});
