const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  if (req.user) {
    res.render("dashboard.hbs");
    return;
  }

  res.render("index.hbs");
});

module.exports = router;
