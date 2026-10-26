import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { build, startServer } from "./helpers.js";

const lesson = "13-quiz";
let server;

before(async () => {
  await build(lesson);
  // from the repository root on purpose: the page and the data are found
  // next to the code, not in the current directory
  server = await startServer(lesson, [`${lesson}/dist/index.js`], { cwd: "." });
});
after(() => server?.stop());

const records = async (query) => {
  const res = await fetch(`${server.base}/request?${query}`);
  return { res, body: await res.json() };
};

test("13-quiz: the front page is served", async () => {
  const res = await fetch(server.base);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /text\/html/);
  assert.match(await res.text(), /<title>Records<\/title>/);
});

test("13-quiz: limit picks how many records come back", async () => {
  const { res, body } = await records("limit=3");
  assert.equal(res.status, 200);
  assert.equal(body.length, 3);
  assert.ok(body[0].name && body[0].location && body[0].likeDislike);

  assert.equal((await records("limit=0")).body.length, 0);
});

test("13-quiz: unknown paths answer 404, not an empty page", async () => {
  for (const path of ["/favicon.ico", "/nope", "/request"]) {
    const res = await fetch(server.base + path);
    assert.equal(res.status, 404, path);
  }
});
