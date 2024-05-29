const express = require("express");
const router = new express.Router();
const items = require("./fakeDb");
const ExpressError = require("./expressError");
const findItem = require("./middleware");

router.get("/", function (req, res) {
  return res.json(items);
});

router.post("/", findItem, function (req, res, next) {
  try {
    if (!req.body.name || !req.body.price) throw new ExpressError("Missing name and/or price", 422)
    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    res.status(201).json({ added: newItem });
  } catch (err) {
    next(err);
  }
});

router.get("/:name", findItem, function (req, res) {
  const foundItem = req.foundItem;
  res.json(foundItem);
});

router.patch("/:name", findItem, function (req, res) {
  const foundItem = req.foundItem;
  if (req.body.name) foundItem.name = req.body.name;
  if (req.body.price) foundItem.price = req.body.price;
  res.json({ updated: foundItem });
});

router.delete("/:name", findItem, function (req, res) {
  const foundItem = req.foundItem;
  items.splice(foundItem, 1);
  res.status(202).json({ message: "Deleted" });
});

module.exports = router;
