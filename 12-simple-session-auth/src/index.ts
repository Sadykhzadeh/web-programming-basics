import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { exec } from "child_process";

dotenv.config();

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

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../static')));

app.get('/', (q, res) => {
  res.redirect(q.session.user ? '/profile' : '/login');
});

app.get('/login', (q, res) => {
  res.sendFile(path.join(__dirname + '/../static/login.html'));
});

app.post('/auth', (q, res) => {
  const { username, password } = q.body;
  if (password === 'azer') {
    q.session.user = { username };
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

app.get('/profile', (q, res) => {
  if (q.session.user) {
    res.send(`Welcome ${escapeHtml(q.session.user.username)}!<br><a href="/logout">Logout</a>`);
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (q, res) => {
  q.session.destroy(() => {
    res.redirect('/');
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  const url = `http://localhost:${port}`

  console.log(`Server started! Ready at ${url}`);
  exec(`open ${url}`);
});
