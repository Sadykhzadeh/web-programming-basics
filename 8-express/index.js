import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import hbs from "hbs";

const app = express();
const port = process.env.PORT || 3000;

// folders next to this file, so the app also starts from another directory
const here = path.dirname(fileURLToPath(import.meta.url));

// app.get('', (req, res) => {
//   res.status(200).send(`
//     <h1>Hello, world</h1>
//   `);
// });

app.use(express.static(path.join(here, "public")));

// view engine
app.set("view engine", "hbs");
app.set("views", path.join(here, "views"));
// compile each template once instead of reading it from disk on every request
app.set("view cache", true);

// partials
hbs.registerPartials(path.join(here, "views"));

app.get("", (req, res) => {
  res.render("index", {
    name: "John Doe",
    occupation: "Web Developer",
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// if no route is found
app.use((req, res) => {
  res.status(404).send(`
    <h1>404</h1>
    <p>Page not found</p>
    <a href="/">Go to home</a>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
