require("dotenv").config();

const mongoose = require("mongoose");

const Metro = require("../models/Metro.js");

const metroData = require("../config/metros.json");

mongoose
  .connect("mongodb://localhost/kahani", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

metroData.forEach(metro => {
  Metro.create({
    name: metro.fields.nom_gare,
    line: metro.fields.ligne,
    location: metro.fields.geo_point_2d
  })
    .then(metroResults => {
      console.log(`Inserted ${metroResults.length} METRO STATIONS`);
    })
    .catch(err => {
      console.log("Insert Failure!!", err);
    });
});
