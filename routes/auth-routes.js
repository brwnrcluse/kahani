// ***********************************************************
//                          SETUP
// ***********************************************************
// #####    FROM DOC   #####
// -----------------------------------------------------------
// user model
const User = require("../models/User.js");
// -----------------------------------------------------------
// #####       NPM     #####
// -----------------------------------------------------------
// router
const express = require("express");
const router = express.Router();
module.exports = router;
// -----------------------------------------------------------
// passport
const passport = require("passport");
// -----------------------------------------------------------
// flash
const flash = require("connect-flash");
// -----------------------------------------------------------
//
//
// -----------------------------------------------------------
// ***********************************************************
//                          ROUTES
// ***********************************************************
// -----------------------------------------------------------
// login page
router.get("/login", (req, res, next) => {
  res.render("login.hbs");
});
// -----------------------------------------------------------
// processing the login
router.post("/process-login", (req, res, next) => {
  // successful login -- redirect to browse
});
// -----------------------------------------------------------
// signup page
router.get("/join", (req, res, next) => {
  res.render("join.hbs");
});
// -----------------------------------------------------------
// processing the signup
router.post("/process-join", (req, res, next) => {
  const { username, password, email } = req.body;
  // successful signup -- redirect to browse
});
// -----------------------------------------------------------
