const express = require("express");
const User = require("../models/User.js");
const Metro = require("../models/Metro.js");
const router = express.Router();

/* GET browse page */
router.get("/browse", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You are not LOGGED IN.");
    res.redirect("/login");
    return;
  }
  // creates a 'collectedItems' variable that contains all collected markers
  User.findById(req.user._id)
    .then(userDoc => {
      if (!userDoc) {
        req.flash("error", "Username not in DB.");
        res.redirect("/login");
        return;
      }

      res.locals.collectedItems = userDoc.collected;
      res.render("browse/browse.hbs");
    })
    .catch(err => next(err));
});

module.exports = router;
