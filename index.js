require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", (err) => console.error("ERROR:", err));
// Once connected to database
db.once("open", () => console.log("Connected to Database"));

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

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
