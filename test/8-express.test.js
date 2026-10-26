import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { startServer } from "./helpers.js";

let server;
// started from the repository root on purpose: the lesson must not depend on
// the folder it was started from
before(async () => {
  server = await startServer("8-express", ["8-express/index.js"], { cwd: "." });
});
after(() => server.stop());

const get = (path, init) => fetch(server.base + path, init);

test("8-express: pages are rendered from the templates", async () => {
  const home = await get("/");
  assert.equal(home.status, 200);
  const html = await home.text();
  assert.match(html, /Hello, my name is John Doe/);
  assert.match(html, /Express \+ HBS/);

  assert.match(await (await get("/about")).text(), /About!/);
  assert.match(await (await get("/contact")).text(), /Contact!/);
});

test("8-express: public files are served, templates are not", async () => {
  const css = await get("/style.css");
  assert.equal(css.status, 200);
  assert.match(css.headers.get("content-type"), /text\/css/);
  assert.equal((await get("/meme.jpg")).status, 200);

  for (const leaked of ["/index.hbs", "/about.hbs", "/header.hbs"]) {
    assert.equal((await get(leaked)).status, 404, leaked);
  }
});

test("8-express: unknown pages answer 404 whatever the method", async () => {
  for (const init of [{}, { method: "POST" }]) {
    const res = await get("/nope", init);
    assert.equal(res.status, 404);
    assert.match(await res.text(), /Page not found/);
  }
});
