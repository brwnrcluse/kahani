// setup
require("dotenv").config();
const mongoose = require("mongoose");

// models needed
const User = require("../models/User.js");
const Metro = require("../models/Metro.js");

// connect to db
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

// initialize
let metroElem = {};
console.log(metroElem);

// add a metro element to the user's "active challenges" property -- (using a metro in place of a Challenge object for now)
Metro.findOne({ name: { $eq: "Cambronne" } })
  .then(metroDoc => {
    User.findByIdAndUpdate(
      "5c62f67e6d9ba502f4ed0bd8",
      { $push: { challenges_active: metroDoc } },
      { runValidators: true }
    )
      .then(userDoc => {
        console.log(`Metro added to username : ${userDoc.name}.`);
      })
      .catch(err => console.log("Error when adding to 'User'."));
  })
  .catch(err => {
    console.log("Error when looking for 'Cambronne'.");
  });

console.log(metroElem);
