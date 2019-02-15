require("dotenv").config();
const mongoose = require("mongoose");
const Metro = require("../models/Metro.js");
const metroData = require("../config/metros.json");

const User = require("../models/User.js");
const dummyUsers = require("../config/dummyUsers.json");

const bcrypt = require("bcrypt");

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

// metroData.forEach(metro => {
//   Metro.create({
//     name: metro.fields.nom_gare,
//     line: metro.fields.ligne,
//     location: metro.fields.geo_point_2d
//   })
//     .then(metroResults => {
//       console.log(`Inserted ${metroResults.length} METRO STATIONS`);
//     })
//     .catch(err => {
//       console.log("Insert Failure!!", err);
//     });
// });

dummyUsers.forEach(dummyUser => {
  console.log(`START creating ${dummyUser.username}`);

  // encrypt original password
  const encryptedPassword = bcrypt.hashSync(dummyUser.password, 10);

  let dummyCollected = [];

  Metro.find();

  User.create({
    username: dummyUser.username,
    email: dummyUser.email,
    encryptedPassword: encryptedPassword,
    role: dummyUser.role,
    collected: [],
    challenges_active: dummyUser.challenges_active,
    challenges_completed: dummyUser.challenges_completed,
    challenges_queued: dummyUser.challenges_queued
  })
    .then(userDoc => {
      console.log(`${userDoc.username} is IN DATABASE`);

      // find Metro
      dummyUser.collected.forEach(metroName => {
        Metro.findOne({ name: { $eq: metroName } })
          .then(metroDoc => {
            console.log(metroDoc);
            console.log(metroDoc._id);
            console.log(userDoc);

            // push Metro id to userDoc
            User.findByIdAndUpdate(
              userDoc._id,
              {
                $addToSet: { collected: metroDoc }
              },
              { runValidators: true }
            )
              .then(updatedUser => {
                console.log(`this is in the update`, metroDoc);
                console.log(
                  `${updatedUser.username} has collected ${
                    updatedUser.collected.length
                  } metros`
                );
              })
              .catch(err => {
                console.log(`FAILED to update ${userDoc.username}`);
              });
          })
          .catch(err => {
            console.log(`FAILED to FIND ${metroName}`);
          });
      });
    })
    .catch(err => {
      console.log(`FAILED to CREATE ${dummyUser.username}`, err);
    });
});
