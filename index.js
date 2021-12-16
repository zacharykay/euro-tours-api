const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

const tours = require("./api/Tours");

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

// Body Parser Middleware
app.use(express.json());
// Form Submission Handler Middleware
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public"), { extensions: [ "html" ] }));

app.use(cors(corsOptions));

// app.get("/api", (req, res) => {
//   res.status(200).send(tours);
// });

app.use("/api", require("./routes/api/tours"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
