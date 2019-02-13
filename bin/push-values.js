require("dotenv").config();

const mongoose = require("mongoose");

const User = require("../models/User.js");
const Metro = require("../models/Metro.js");

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

let metroElem = {};

console.log(metroElem);

Metro.findOne({ name: { $eq: "Château d'Eau" } })
  .then(metroDoc => {
    User.findByIdAndUpdate(
      "5c62c976775e58348e76f852",
      { $push: { collected: metroDoc } },
      { runValidators: true }
    )
      .then(userDoc => {
        console.log(`Metro added to username : ${userDoc.name}.`);
      })
      .catch(err => console.log("Error when adding to 'Armand'."));
  })
  .catch(err => {
    console.log("Error when looking for 'Cambronne'.");
  });

console.log(metroElem);
