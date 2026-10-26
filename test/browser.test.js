import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadPage, root } from "./helpers.js";

test("4-table-objects-target: a button shows its table", async () => {
  const { window } = await loadPage("4-table-objects-target");
  const { document } = window;

  document.getElementById("A").click();
  assert.equal(document.querySelectorAll("#text tr").length, 3);

  document.getElementById("AA").click();
  const head = document.querySelectorAll("#anotherText thead th");
  assert.deepEqual([...head].map((th) => th.textContent), [
    "ID",
    "Command Name",
    "Points",
    "Average",
  ]);
  assert.equal(document.querySelectorAll("#anotherText tbody tr").length, 4);
});

test("5-form-validation: every password problem is listed on its own line", async () => {
  const { window } = await loadPage("5-form-validation");
  const { document } = window;

  document.getElementById("uname").value = "azer";
  document.getElementById("pass").value = "a";
  document.getElementById("confirmation").value = "a";
  document.getElementById("submit").click();

  // too short, no uppercase letter, no number
  assert.equal(document.querySelectorAll("#passwordInfo br").length, 3);
  assert.equal(document.getElementById("usernameInfo").textContent, "");
  assert.equal(document.getElementById("confirmationInfo").textContent, "Passwords match!");

  document.getElementById("pass").value = "Abcdefg1";
  document.getElementById("confirmation").value = "Abcdefg1";
  document.getElementById("submit").click();
  assert.equal(document.getElementById("passwordInfo").textContent, "");
});

test("4.3-task-list: tasks are list items that can be added and deleted", async () => {
  const { window } = await loadPage("4.3-task-list");
  const { document } = window;
  const items = () => [...document.querySelectorAll("#tasks li")];

  assert.equal(items().length, 8);

  document.getElementById("task").value = "<img src=x onerror=alert(1)>";
  document.getElementById("but").click();
  assert.equal(items().length, 9);
  assert.equal(document.querySelector("#tasks img"), null);
  assert.match(items().at(-1).textContent, /<img src=x/);

  items()[0].querySelector("button.delete").click();
  assert.equal(items().length, 8);
  assert.match(document.querySelector("#tasks h3").textContent, /Total tasks: 8/);
});

test("3.2-classwork-flights: the summary names the round way box correctly", async () => {
  const { window } = await loadPage("3.2-classwork-flights");
  const { document } = window;
  const change = (id, props) => {
    const el = document.getElementById(id);
    Object.assign(el, props);
    el.dispatchEvent(new window.Event("change"));
  };

  change("passengers", { value: "2" });
  change("child", { value: "5" });
  assert.match(document.getElementById("result").textContent, /Is round way: No/);

  change("isRoundWay", { checked: true });
  assert.match(document.getElementById("result").textContent, /Is round way: Yes/);
});

const todos = (titles) =>
  titles.map((title, i) => ({ id: i + 1, title }));

// resolves once `check` passes, polling because the lesson works with timers
const until = async (check, ms = 5000) => {
  const deadline = Date.now() + ms;
  while (!check()) {
    if (Date.now() > deadline) throw new Error("timed out");
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
};

test("6-callbacks-promises: posts are shown before the internet request starts", async () => {
  let contentWhenFetched = null;
  const { window } = await loadPage("6-callbacks-promises", (window) => {
    window.fetch = async () => {
      contentWhenFetched = window.document.getElementById("content").innerHTML;
      return { ok: true, json: async () => todos(["one", "two"]) };
    };
  });

  await until(() => contentWhenFetched !== null);
  assert.match(contentWhenFetched, /Post 3/);
  assert.match(contentWhenFetched, /World!/);
  window.close();
});

test("6-callbacks-promises: the first 20 todos are listed one per line", async () => {
  const titles = Array.from({ length: 25 }, (_, i) => `todo ${i + 1}`);
  const { window } = await loadPage("6-callbacks-promises", (window) => {
    window.fetch = async () => ({ ok: true, json: async () => todos(titles) });
  });
  const target = window.document.getElementById("fromInternet");

  await until(() => target.innerHTML.includes("todo"));
  const lines = target.innerHTML.split("<br>").filter(Boolean);
  assert.equal(lines.length, 20);
  assert.equal(lines[0], "1 todo 1");
  assert.ok(!target.textContent.includes(","));
  window.close();
});

test("6-callbacks-promises: text from the internet is not parsed as HTML", async () => {
  const hostile = "<img src=x onerror=alert(1)>";
  const { window } = await loadPage("6-callbacks-promises", (window) => {
    window.fetch = async (url) => ({
      ok: true,
      json: async () =>
        String(url).includes("chucknorris")
          ? { value: hostile }
          : todos([hostile]),
    });
  });
  const { document } = window;

  await until(() => document.getElementById("fromInternet").textContent.includes("img"));
  assert.equal(document.querySelector("#fromInternet img"), null);

  document.getElementById("btn3").click();
  await until(() => document.getElementById("contentFetch").textContent.includes("img"));
  assert.equal(document.querySelector("#contentFetch img"), null);
  window.close();
});

test("6-callbacks-promises: a failed request shows a message", async () => {
  const { window } = await loadPage("6-callbacks-promises", (window) => {
    window.fetch = async () => {
      throw new TypeError("offline");
    };
  });
  const { document } = window;

  await until(() => document.getElementById("fromInternet").textContent !== "");
  assert.equal(document.getElementById("fromInternet").textContent, "Could not load data.");

  document.getElementById("btn3").click();
  await until(() => document.getElementById("contentFetch").textContent !== "");
  assert.equal(document.getElementById("contentFetch").textContent, "Could not load data.");
  window.close();
});

const localFetch = (lesson) => async (url) => {
  const file = new URL(url, `file://${root}/${lesson}/`);
  try {
    const body = readFileSync(file, "utf8");
    return { ok: true, status: 200, json: async () => JSON.parse(body) };
  } catch {
    return { ok: false, status: 404, json: async () => ({}) };
  }
};

const pick = async (window, continent) => {
  const select = window.document.getElementById("continents");
  select.value = continent;
  select.dispatchEvent(new window.Event("change"));
  await until(() => !window.document.getElementById("content").textContent.includes("Loading"));
};

test("6.2-classwork-continents: every continent lists its countries", async () => {
  const { window } = await loadPage("6.2-classwork-continents", (window) => {
    window.fetch = localFetch("6.2-classwork-continents");
  });
  const { document } = window;
  const names = () =>
    [...document.querySelectorAll("#content .country h2")].map((h) => h.textContent);

  await pick(window, "Europe");
  assert.ok(names().includes("Germany"));
  assert.ok(!names().includes("Japan"));

  await pick(window, "South America");
  assert.ok(names().includes("Brazil"));

  // no capital, no area for some of these: they must not break the page
  await pick(window, "Antarctica");
  assert.ok(names().includes("Antarctica"));
  assert.match(document.getElementById("content").textContent, /Capital: none/);

  await pick(window, "nothing");
  assert.match(document.getElementById("content").textContent, /Please select/);
  window.close();
});

test("6.2-classwork-continents: a missing data file shows a message", async () => {
  const { window } = await loadPage("6.2-classwork-continents", (window) => {
    window.fetch = async () => ({ ok: false, status: 404 });
  });
  await pick(window, "Asia");
  assert.equal(window.document.getElementById("content").textContent, "Could not load countries.");
  window.close();
});

const feed = (name, url) => ({
  name,
  location: "Somewhere",
  multiMedia: [{ url }],
  likeDislike: { likes: 1, dislikes: 2 },
});

test("13-quiz: only real web addresses become links", async () => {
  const records = [
    feed("with https", "https://example.com/a?x=1&y=2"),
    feed("without a link", null),
    feed("relative path", "feedsmedia/1/photo.jpg"),
    feed("embed code", '<iframe src="https://example.com/embed"></iframe>'),
    feed('quote " breaker', 'https://example.com/" onmouseover="alert(1)'),
  ];
  const { window } = await loadPage("13-quiz", (window) => {
    window.fetch = async () => ({ json: async () => records });
  }, "static/index.html");
  const { document } = window;

  await until(() => document.querySelectorAll(".objectBox").length === records.length);
  const links = [...document.querySelectorAll(".objectBox a")];
  assert.deepEqual(links.map((a) => a.getAttribute("href")), [
    "https://example.com/a?x=1&y=2",
    'https://example.com/" onmouseover="alert(1)',
  ]);
  assert.equal(document.querySelectorAll("[onmouseover]").length, 0);
  assert.equal(document.querySelector(".objectBox iframe"), null);
  window.close();
});

test("13.1-quiz: the pages say so when the API fails", async () => {
  const failing = (window) => {
    window.fetch = async () => ({ ok: false, status: 500, json: async () => ({ message: "Database error" }) });
    window.alert = () => {};
  };

  const list = await loadPage("13.1-quiz", failing, "public/index.html");
  await until(() => list.window.document.getElementById("suppliers").textContent !== "");
  assert.equal(list.window.document.getElementById("suppliers").textContent, "Could not load the suppliers.");
  list.window.close();

  const add = await loadPage("13.1-quiz", failing, "public/add.html");
  await until(() => add.window.document.getElementById("supplier").textContent !== "");
  assert.equal(add.window.document.getElementById("supplier").textContent, "Could not load the suppliers.");
  add.window.close();
});

test("4.2-card-order: the order summary adds up and the name is escaped", async () => {
  const { window } = await loadPage("4.2-card-order");
  const { document } = window;
  const change = (id, props) => {
    const el = document.getElementById(id);
    Object.assign(el, props);
    el.dispatchEvent(new window.Event("change"));
  };

  change("type", { value: "American Express-200" });
  change("gold", { checked: true });
  change("cashback", { checked: true });
  change("ApplePay", { checked: true });
  change("name", { value: "<b>Azer</b>" });
  change("surname", { value: "S" });

  const result = document.getElementById("result");
  assert.match(result.textContent, /TOTAL: \$295/);
  assert.equal(result.querySelector("b > b"), null);
  assert.match(result.textContent, /Name: <b>Azer<\/b> S/);
  // block content (heading, list, paragraphs) cannot live inside a span
  assert.equal(result.tagName, "DIV");
});
