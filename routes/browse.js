const express = require("express");
const router = express.Router();

/* GET browse page */
router.get("/browse", (req, res, next) => {
  res.render("browse/browse.hbs");
});

module.exports = router;
