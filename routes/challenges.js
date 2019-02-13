const express = require("express");
const User = require("../models/User.js");
const Metro = require("../models/Metro.js");
const Challenge = require("../models/Challenge.js");
const router = express.Router();

router.get("/challenges", (req, res, next) => {
  res.render("challenges.hbs");
});

module.exports = router;
