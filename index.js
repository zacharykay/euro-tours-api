require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const session = require("express-session");
const MongoStore = require("connect-mongo");

// const localDbUrl = process.env.DATABASE_URL;
// const atlasDbUrl = process.env.ATLAS_DB_URL;
// const prodUrl = "https://eurotours.netlify.app";

const app = express();

const mongoose = require("mongoose");

mongoose.connect(process.env.ATLAS_DB_URL, { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", (err) => console.error("ERROR:", err));
// Once connected to database
db.once("open", () => console.log("Connected to Database"));

// CORS Configuration Object
const corsOptions = {
  // origin: process.env.CORS || "http://localhost:3000",
  origin: "https://eurotours.netlify.app/",
  optionsSuccessStatus: 200,
};

// MongoDB Atlas Store Configuration Object
const store = {
  mongoUrl: process.env.ATLAS_DB_URL,
  secret: process.env.STORE_SECRET,
  touchAfter: 60 * 60 * 24,
};

// MongoDB Atlas Session Configuration Object
const sessionConfig = {
  store: MongoStore.create(store),
  name: "session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 100 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(function(req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
  );
  next();
});

// MongoDB Atlas Middleware
app.use(session(sessionConfig));

// Body Parser Middleware
app.use(express.json());
// Form Submission Handler Middleware
app.use(express.urlencoded({ extended: false }));

// Allow static files to load in public directory and remove potential .html postfixes
app.use(express.static(path.join(__dirname, "public"), { extensions: [ "html" ] }));

// Set universal CORS options as Middleware
app.use(cors(corsOptions));

app.use("/api", require("./routes/api/tours"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
