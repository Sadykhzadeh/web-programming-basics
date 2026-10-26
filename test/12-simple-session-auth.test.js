import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { build, startServer } from "./helpers.js";

const lesson = "12-simple-session-auth";
let server;

before(async () => {
  await build(lesson);
  server = await startServer(lesson, ["dist/index.js"]);
});
after(() => server?.stop());

const request = (path, { cookie, form } = {}) =>
  fetch(server.base + path, {
    redirect: "manual",
    method: form ? "POST" : "GET",
    headers: {
      ...(cookie && { Cookie: cookie }),
      ...(form && { "Content-Type": "application/x-www-form-urlencoded" }),
    },
    body: form && new URLSearchParams(form),
  });

const signIn = async (username, password = "azer") => {
  const res = await request("/auth", { form: { username, password } });
  const cookie = res.headers.get("set-cookie")?.split(";")[0];
  return { res, cookie };
};

test("12-simple-session-auth: visitors are sent to the login page", async () => {
  const home = await request("/");
  assert.equal(home.status, 302);
  assert.equal(home.headers.get("location"), "/login");

  assert.equal((await request("/profile")).headers.get("location"), "/login");

  const login = await request("/login");
  assert.equal(login.status, 200);
  assert.match(await login.text(), /<form class="form" action="\/auth"/);
});

test("12-simple-session-auth: a wrong password does not sign in", async () => {
  const { res, cookie } = await signIn("azer", "nope");
  assert.equal(res.status, 302);
  assert.equal(res.headers.get("location"), "/login");
  assert.equal(cookie, undefined);

  const empty = await signIn("", "azer");
  assert.equal(empty.res.headers.get("location"), "/login");
});

test("12-simple-session-auth: signing in opens a session with a safe cookie", async () => {
  const { res, cookie } = await signIn("azer");
  assert.equal(res.headers.get("location"), "/");
  assert.match(res.headers.get("set-cookie"), /HttpOnly/i);
  assert.match(res.headers.get("set-cookie"), /SameSite=Lax/i);

  const profile = await request("/profile", { cookie });
  assert.equal(profile.status, 200);
  assert.match(await profile.text(), /Welcome azer!/);

  const home = await request("/", { cookie });
  assert.equal(home.headers.get("location"), "/profile");
});

test("12-simple-session-auth: the name is escaped on the profile page", async () => {
  const { cookie } = await signIn("<img src=x onerror=alert(1)>");
  const html = await (await request("/profile", { cookie })).text();
  assert.ok(!html.includes("<img"));
  assert.ok(html.includes("&lt;img src=x"));
});

test("12-simple-session-auth: signing in again changes the session id", async () => {
  const first = await signIn("azer");
  const second = await request("/auth", {
    cookie: first.cookie,
    form: { username: "azer", password: "azer" },
  });
  const next = second.headers.get("set-cookie")?.split(";")[0];
  assert.ok(next);
  assert.notEqual(next, first.cookie);
});

test("12-simple-session-auth: logging out is a POST and ends the session", async () => {
  const { cookie } = await signIn("azer");

  // a link or an image on another site must not be able to log the user out
  await request("/logout", { cookie });
  assert.equal((await request("/profile", { cookie })).status, 200);

  const profile = await (await request("/profile", { cookie })).text();
  assert.match(profile, /<form method="post" action="\/logout">/);

  const out = await request("/logout", { cookie, form: {} });
  assert.equal(out.headers.get("location"), "/");
  assert.equal((await request("/profile", { cookie })).headers.get("location"), "/login");
});
