// ***********************************************************
//                          SETUP
// ***********************************************************

// user model
const User = require("../models/User.js");

// router
const express = require("express");
const router = express.Router();
module.exports = router;

// bcrypt
const bcrypt = require("bcrypt");

// ***********************************************************
//                          ROUTES
// ***********************************************************

// LOGIN
// -----------------------------------------------------------
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

// PROCESS 'LOGIN' FORM
// -----------------------------------------------------------
router.post("/process-login", (req, res, next) => {
  // read in login form info
  const { username, originalPassword } = req.body;

  // ensure all fields are filled
  if (!username || !originalPassword) {
    req.flash("error", "please fill out all fields");
    res.redirect("/");
    return;
  }

  // search for user (usernames are unique)
  User.findOne({ username: { $eq: username } })
    .then(userDoc => {
      // checks if username exists in db
      if (!userDoc) {
        req.flash("error", "Username is incorrect or doesn't exist.");
        res.redirect("/");
        return;
      }

      // username exists => now proceed to check password
      const { encryptedPassword } = userDoc;
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        req.flash("error", "Sorry, wrong password...");
        res.redirect("/");
        return;
      }

      // password matching => establishes new session
      req.logIn(userDoc, () => {
        req.flash("success", "Log in success!");
        res.redirect("/");
      });
    })
    .catch(err => next(err));
});

// JOIN
// -----------------------------------------------------------
router.get("/join", (req, res, next) => {
  res.render("auth/join.hbs");
});

// PROCESS 'JOIN' FORM
// -----------------------------------------------------------
router.post("/process-join", (req, res, next) => {
  const { username, email, originalPassword } = req.body;

  // ensure all fields are filled
  if (!username || !email || !originalPassword) {
    req.flash("error", "Please, fill out ALL fields.");
    res.redirect("/");
    return;
  }

  // --- !!! BONUS : WE COULD ADD PASSWORD VALIDATOR W/ 1 NUMBER AT LEAST !!!  ----
  // --- !!! BONUS : WE COULD ADD PASSWORD STRENGTH PLUGIN HERE --> https://www.jquerycards.com/forms/inputs/strength-js/ !!!  ----

  // check if username currently exists
  User.findOne({ username: { $eq: username } })
    .then(userDoc => {
      if (userDoc) {
        req.flash("error", "Username already exists!");
        res.redirect("/");
        return;
      }
    })
    .catch(err => next(err));

  // check if email currently exists
  User.findOne({ email: { $eq: email } })
    .then(userDoc => {
      if (userDoc) {
        req.flash("error", "There is already an account with this email!");
        // ADD A FIND/RETRIEVE PASSWORD FUNCTIONALITY TO JOIN.HBS
        res.redirect("/");
        return;
      }
    })
    .catch(err => next(err));

  // encrypt original password
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  // create new user
  User.create({ username, email, encryptedPassword })
    .then(() => {
      User.findOne({ username: { $eq: username } })
        .then(userDoc => {
          req.logIn(userDoc, () => {
            req.flash(
              "success",
              "You've successfully created a new account. Welcome!"
            );
            res.redirect("/");
          });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// router.get("/dashboard", (req, res, next) => {
//   res.render("dashboard.hbs");
// });

// LOGOUT
// -----------------------------------------------------------
router.get("/logout", (req, res, next) => {
  req.logOut();
  req.flash("success", "Logged out successfully!");
  res.redirect("/");
});
