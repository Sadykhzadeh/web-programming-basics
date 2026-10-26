import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { Script } from "node:vm";
import { JSDOM } from "jsdom";
import { root } from "./helpers.js";

// Lessons that run in the browser: no server, just files.
const lessons = [
  "1-html-basics",
  "2-simple-form",
  "3-javascript-basics",
  "3.2-classwork-flights",
  "4-table-objects-target",
  "4.2-card-order",
  "4.3-task-list",
  "5-form-validation",
  "6-callbacks-promises",
  "6.2-classwork-continents",
];

const htmlFiles = (lesson) =>
  readdirSync(join(root, lesson)).filter((name) => name.endsWith(".html"));

for (const lesson of lessons) {
  test(`${lesson}: local scripts, styles and links exist`, () => {
    for (const page of htmlFiles(lesson)) {
      const { document } = new JSDOM(
        readFileSync(join(root, lesson, page), "utf8"),
      ).window;
      const refs = [
        ...document.querySelectorAll("script[src], link[href], a[href]"),
      ].map((el) => el.getAttribute("src") ?? el.getAttribute("href"));
      for (const ref of refs) {
        if (/^(https?:|#|mailto:)/.test(ref)) continue;
        const file = join(root, lesson, dirname(page), ref.split(/[?#]/)[0]);
        assert.ok(existsSync(file), `${lesson}/${page} points to missing ${ref}`);
      }
    }
  });

  test(`${lesson}: scripts parse`, () => {
    for (const name of readdirSync(join(root, lesson))) {
      if (!name.endsWith(".js")) continue;
      new Script(readFileSync(join(root, lesson, name), "utf8"), {
        filename: `${lesson}/${name}`,
      });
    }
  });
}
