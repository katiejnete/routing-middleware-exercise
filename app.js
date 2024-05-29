const express = require("express");
const ExpressError = require("./expressError");

const itemRoutes = require("./items");

const app = express();

app.use(express.json());
app.get("/favicon.ico", (req, res) => res.sendStatus(204));
app.use("/items", itemRoutes);

app.use((req, res, next) => {
  const err = new ExpressError("Page not found", 404);
  next(err);
});

app.use(function (err, req, res, next) {
  let message = err.message;
  let status = err.status || 500;
  return res.status(status).json({ error: { message, status } });
});

module.exports = app;
