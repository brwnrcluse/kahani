// -----------------------------------------------------------
// ***********************************************************
//                          SETUP
// ***********************************************************
// -----------------------------------------------------------

// #####    FROM DOC   #####
// -----------------------------------------------------------
// user model
// -----------------------------------------------------------
const User = require("../models/User.js");
// -----------------------------------------------------------

// #####       NPM     #####
// -----------------------------------------------------------
// router
// -----------------------------------------------------------
const express = require("express");
const router = express.Router();
module.exports = router;
// -----------------------------------------------------------
// passport
// -----------------------------------------------------------
const passport = require("passport");
// -----------------------------------------------------------
// flash
// -----------------------------------------------------------
const flash = require("connect-flash");
// -----------------------------------------------------------
// bcrypt
// -----------------------------------------------------------
const bcrypt = require("bcrypt");
// -----------------------------------------------------------

// -----------------------------------------------------------
// ***********************************************************
//                          ROUTES
// ***********************************************************
// -----------------------------------------------------------

// -----------------------------------------------------------
// LOGIN
// -----------------------------------------------------------
router.get("/login", (req, res, next) => {
  // ---------------------------------------
  // render login form
  // ---------------------------------------
  res.render("../views/auth/login.hbs");
});

// -----------------------------------------------------------
// PROCESS THE LOGIN FORM
// -----------------------------------------------------------
router.post("/process-login", (req, res, next) => {
  // ---------------------------------------
  // read in login form info
  // ---------------------------------------
  const { username, originalPassword } = req.body;
  // ---------------------------------------
  // ensure all fields are filled
  // ---------------------------------------
  if (!username || !originalPassword) {
    req.flash("error", "please fill out all fields");
    res.redirect("/login");
    return;
  }
  // ---------------------------------------
  // search for user (usernames are unique)
  // ---------------------------------------
  User.findOne({ username: { $eq: username } })
    .then(userDoc => {
      // ---------------------------------------
      // if we're here, username exists
      // proceed to check password
      // ---------------------------------------
      const encryptedPassword = { userDoc };
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        req.flash("error", "sorry, wrong password");
        res.redirect("login");
        return;
      }
      // ---------------------------------------
      // if we're here, passwords match
      // send success message & redirect to browse (with user view)
      // ---------------------------------------
      req.flash("success", "you've successfully logged in!");
      res.redirect("/browse");
    })
    .catch(err => next(err));
});

// -----------------------------------------------------------
// JOIN
// -----------------------------------------------------------
router.get("/join", (req, res, next) => {
  // ---------------------------------------
  // render join form
  // ---------------------------------------
  res.render("../views/auth/join.hbs");
});

// -----------------------------------------------------------
// PROCESS THE JOIN FORM
// -----------------------------------------------------------
router.post("/process-join", (req, res, next) => {
  // ---------------------------------------
  // read in join form info
  // ---------------------------------------
  const { username, originalPassword, email } = req.body;

  // ---------------------------------------
  // ensure all fields are filled
  // ---------------------------------------
  if (!username || !originalPassword || !email) {
    req.flash("error", "please fill out all the fields");
    res.redirect("/join");
    return;
  }

  // ---------------------------------------
  // check if username currently exists
  // ---------------------------------------
  User.findOne({ username: { $eq: username } })
    .then(userDoc => {
      if (userDoc) {
        req.flash("error", "username already exists!");
        res.redirect("/join");
        return;
      }
    })
    .catch(err => next(err));

  // ---------------------------------------
  // check if email currently exists
  // ---------------------------------------
  User.findOne({ email: { $eq: email } })
    .then(userDoc => {
      if (userDoc) {
        req.flash("error", "there is already an account with this email!");
        // ADD A FIND/RETRIEVE PASSWORD FUNCTIONALITY TO JOIN.HBS
        res.redirect("/join");
        return;
      }
    })
    .catch(err => next(err));

  // ---------------------------------------
  // if we're here, all uniqueness criteria have been met & we can create a new user
  // encrypt original password
  // ---------------------------------------
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  // ---------------------------------------
  // create new user using encrypted password
  // ---------------------------------------
  User.create({ username, encryptedPassword, email })
    .then(userDoc => {
      // ---------------------------------------
      // if we're here, user match
      // send success message & redirect to browse (with user view)
      // ---------------------------------------
      req.flash("success", "you've successfully created an account!");
      res.redirect("/browse");
    })
    .catch(err => next(err));
});
// -----------------------------------------------------------
