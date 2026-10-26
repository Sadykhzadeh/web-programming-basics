import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { randomBytes } from "crypto";

dotenv.config({ quiet: true });

const app: express.Application = express();

// The name comes out of a form and goes into a page. Without this, signing in
// as <img src=x onerror=...> is enough to make the profile page run it.
function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

declare module "express-session" {
  export interface SessionData {
    user: any;
  }
}

// Without SESSION_SECRET in .env a random one is used, so sessions
// just do not survive a restart. Never fall back to a fixed string.
app.use(session({
  secret: process.env.SESSION_SECRET || randomBytes(32).toString("hex"),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // not readable from document.cookie
    sameSite: "lax", // not sent with cross-site POSTs
    secure: false, // set to true when served over HTTPS
  },
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../static')));

app.get('/', (q, res) => {
  res.redirect(q.session.user ? '/profile' : '/login');
});

app.get('/login', (q, res) => {
  res.sendFile(path.join(__dirname + '/../static/login.html'));
});

app.post('/auth', (q, res) => {
  const { username, password } = q.body ?? {};
  if (typeof username === 'string' && username.length > 0 && username.length <= 50 && password === 'azer') {
    // new session id after login, so an id set before it is useless
    q.session.regenerate(() => {
      q.session.user = { username };
      res.redirect('/');
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/profile', (q, res) => {
  if (q.session.user) {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,minimum-scale=1">
  <title>Profile</title>
</head>
<body>
  <h1>Welcome ${escapeHtml(q.session.user.username)}!</h1>
  <form method="post" action="/logout"><button>Logout</button></form>
</body>
</html>`);
  } else {
    res.redirect('/login');
  }
});

// POST, so that a link or an image on another site cannot log the user out
app.post('/logout', (q, res) => {
  q.session.destroy(() => {
    res.redirect('/');
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  const url = `http://localhost:${port}`

  console.log(`Server started! Ready at ${url}`);
});
