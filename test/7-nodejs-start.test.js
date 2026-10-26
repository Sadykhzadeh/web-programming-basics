import { test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { root, startServer } from "./helpers.js";

const lesson = "7-nodejs-start";
const run = promisify(execFile);

const serves = async (options) => {
  const server = await startServer(lesson, [`${options.cwd === "." ? lesson + "/" : ""}1-http.js`], options);
  try {
    const res = await fetch(server.base);
    assert.equal(res.status, 200);
    assert.equal(
      await res.text(),
      await readFile(join(root, lesson, "some.html"), "utf8"),
    );
  } finally {
    await server.stop();
  }
};

test("7-nodejs-start: 1-http serves some.html", () => serves({}));

// these examples write into the lesson folder, so they run on a copy
test("7-nodejs-start: the offline examples run", async () => {
  const copy = await mkdtemp(join(tmpdir(), "wpb-7-"));
  try {
    await cp(join(root, lesson), copy, {
      recursive: true,
      filter: (src) => !src.includes("node_modules"),
    });
    // 4-validator needs the lesson's own node_modules
    await cp(join(root, lesson, "node_modules"), join(copy, "node_modules"), {
      recursive: true,
    });
    const out = async (file) => (await run(process.execPath, [file], { cwd: copy })).stdout;

    assert.match(await out("2-import-from-other-file.js"), /Hello from data-for-export/);
    const log = await run(process.execPath, ["3-log.js"], { cwd: copy });
    assert.match(log.stderr, /\[ERROR\]/);
    assert.match(await out("4-validator.js"), /"hello@azer.one" is valid/);
    assert.match(await out("5-file-system.js"), /Hello, World!/);
  } finally {
    await rm(copy, { recursive: true, force: true });
  }
});
