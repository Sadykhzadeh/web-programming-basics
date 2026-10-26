import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { once } from "node:events";
import { join } from "node:path";
import { root, startServer } from "./helpers.js";

const lesson = "7.2-task";
const users = JSON.parse(readFileSync(join(root, lesson, "users.json"), "utf8"));

// stands in for jsonplaceholder, so the test needs no internet and counts calls
let apiCalls = 0;
let apiUsers = users;
const api = createServer((req, res) => {
  apiCalls++;
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
after(async () => {
  await server.stop();
  api.close();
});

test("7.2-task: the page lists the users the API returned", async () => {
  const res = await fetch(server.base);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /<h1>Users<\/h1>/);
  assert.ok(html.includes(users[0].email));
  assert.equal(html.match(/<tr><td>/g).length, users.length);
});
