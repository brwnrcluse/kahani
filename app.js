require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);

// run the code inside the passport-setup.js
require("./config/passport-setup.js");

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

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views", "partials"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// Makes our Express app create SESSIONS
app.use(
  session({
    saveUninitialized: true,
    resave: true,
    secret: "ca^khT8KYd,G73C7R9(;^atb?h>FTWdbn4pqEFUKs3",
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// PASSPORT LINES MUST BE BELOW SESSION
// set up Passport's methods to use in our routes (properties and methods for "req")
app.use(passport.initialize());
app.use(passport.session());

// allow our routes to use FLASH MESSAGES (feedback messages before redirects)
app.use(flash());

// app.use() defines our own MIDDLEWARE function
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.currentUser = req.user;
  res.locals.allItems = [];
  res.locals.coord = { latitude: 0, longitude: 0 };

  next();
});

// default value for title local
app.locals.title = "kahani";

// loading all metro stations
require("./config/metrolist-load.js");

const index = require("./routes/index.js");
app.use("/", index);

const auth = require("./routes/auth.js");
app.use("/", auth);

const browse = require("./routes/browse.js");
app.use("/", browse);

// export app
module.exports = app;
