# 12: Simple Session Auth

Express + `express-session` login demo in TypeScript.

## Run

```
npm install
cp .env.example .env   # optional: set SESSION_SECRET and PORT
npm run build
npm start
```

Open http://localhost:3000 (or your `PORT`). Any username works, the demo
password is `azer`.

Without `SESSION_SECRET` a random secret is generated on every start, so you are
logged out after a restart.
