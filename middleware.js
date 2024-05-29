const ExpressError = require("./expressError");

function findItem(req, res, next) {
  try {
    if (req.method !== "POST") {
      const foundItem = items.find((item) => item.name === req.params.name);
      if (!foundItem) throw new ExpressError("Item not found", 404);
      req.foundItem = foundItem;
      next();
    } else if (req.method === "POST") {
      const foundItem = items.find((item) => item.name === req.body.name);
      if (foundItem) {
        throw new ExpressError("Item already exists", 409);
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

module.exports = findItem;
