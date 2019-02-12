const Metro = require("../models/Metro.js");

// update the 'allItems' global variable => now contains all metro stations from the DB
Metro.find()
  .then(results => {
    req.app.locals.allItems = results;
  })
  .catch(err => next(err));
