import { test } from "node:test";
import assert from "node:assert/strict";
import { loadPage } from "./helpers.js";

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
