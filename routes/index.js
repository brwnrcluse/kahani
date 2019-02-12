const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index.hbs");
});

router.get("/challenges", (req, res, next) => {
  res.render("challenges.hbs");
});

module.exports = router;
