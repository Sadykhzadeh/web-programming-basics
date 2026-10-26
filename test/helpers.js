import { spawn } from "node:child_process";
import { once } from "node:events";
import { connect, createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { JSDOM } from "jsdom";

export const root = fileURLToPath(new URL("..", import.meta.url));

// Opens <lesson>/index.html with its scripts running, like a browser would.
// `beforeParse` can add things jsdom does not have, such as fetch.
export const loadPage = async (lesson, beforeParse = () => {}) => {
  const dom = await JSDOM.fromFile(join(root, lesson, "index.html"), {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    beforeParse,
  });
  await new Promise((resolve) =>
    dom.window.document.readyState === "complete"
      ? resolve()
      : dom.window.addEventListener("load", resolve)
  );
  return dom;
};

const freePort = () =>
  new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });

// Starts `node <args>` on a free port (passed as PORT) and resolves once it
// answers HTTP requests. It runs inside the lesson folder unless `cwd` says
// otherwise, and `args` are relative to that folder.
export const startServer = async (lesson, args, { env = {}, cwd = lesson } = {}) => {
  const port = await freePort();
  const child = spawn(process.execPath, args, {
    cwd: join(root, cwd),
    env: { ...process.env, PORT: String(port), ...env },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (chunk) => (output += chunk));
  child.stderr.on("data", (chunk) => (output += chunk));
  let exited = false;
  child.once("exit", () => (exited = true));

  const base = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + 15000;
  for (;;) {
    if (exited) throw new Error(`${lesson} exited early:\n${output}`);
    if (Date.now() > deadline) {
      child.kill();
      throw new Error(`${lesson} did not start:\n${output}`);
    }
    try {
      await fetch(base);
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return {
    base,
    output: () => output,
    stop: async () => {
      if (exited) return;
      child.kill();
      await once(child, "exit");
    },
  };
};

// The lessons that talk to MySQL are skipped where no server answers on the
// default port.
export const mysqlUp = () =>
  new Promise((resolve) => {
    const socket = connect({ host: "127.0.0.1", port: 3306 });
    socket.setTimeout(1000, () => socket.destroy());
    socket.once("connect", () => socket.end() && resolve(true));
    socket.once("error", () => resolve(false));
    socket.once("close", () => resolve(false));
  });
