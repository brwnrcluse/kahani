const express = require("express");
const User = require("../models/User.js");
const Metro = require("../models/Metro.js");
const router = express.Router();

/* BROWSE page */
router.get("/browse", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You are not LOGGED IN.");
    res.redirect("/login");
    return;
  }

  res.render("browse/browse.hbs");
});

/* Retrieve ALL METROS from database */
router.get("/allmetros", (req, res, next) => {
  Metro.find()
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

/* Retrieve ONLY COLLECTED METROS from database */
router.get("/mymetros", (req, res, next) => {
  User.findById(req.user._id)
    .populate("collected")
    .then(result => res.json(result))
    .catch(err => next(err));
});

/* Add an item to collected items once clicked on its circle */
router.post("/clicked", (req, res, next) => {
  const { itemName } = req.body;

  Metro.findOne({ name: { $eq: itemName } })
    .then(metroDoc => {
      User.findByIdAndUpdate(
        req.user._id,
        { $push: { collected: metroDoc } },
        { runValidators: true }
      )
        .then(userDoc => {
          console.log(`Item correctly added to username : ${userDoc.name}.`);
        })
        .catch(err => console.log("Error when adding to user collection", err));
    })
    .catch(err => {
      console.log("Error when looking for item in database", err);
    });
});

module.exports = router;
