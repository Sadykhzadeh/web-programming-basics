import express from "express";
import path from "path";
import hbs from "hbs";

const app = express();
const port = 3000;

// app.get('', (req, res) => {
//   res.status(200).send(`
//     <h1>Hello, world</h1>
//   `);
// });

app.use(express.static("views"));

// view engine
app.set("view engine", "hbs");
app.set("views", path.join(path.resolve(), "views"));

// partials
hbs.registerPartials(path.join(path.resolve(), "views"));

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
app.get("*", (req, res) => {
  res.status(404).send(`
    <h1>404</h1>
    <p>Page not found</p>
    <a href="/">Go to home</a>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
