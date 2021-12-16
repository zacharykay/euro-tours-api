const fs = require("fs");
const path = require("path");

const express = require("express");

const router = express.Router();

const tours = fs.readFileSync(path.join(__dirname, "../../api/Tours.js"), "utf-8");
// console.log(
//   "TOURSSSSS",
//   fs.readFileSync(path.join(__dirname, "../../api/Tours.js"), "utf-8")
// );
// console.log("TOURS", tours);

const toursDataFile = path.join(__dirname, "../../api/Tours.js");

const CORSAllow = process.env.CORS || "*";

router.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", CORSAllow).json(tours);
  console.log(tours);
});

router.post("/", async (req, res) => {
  req.header("Access-Control-Allow-Origin", CORSAllow);
  const newData = await req.body;
  // const data = await JSON.parse(request);
  const updatedTours = tours;
  updatedTours.push(newData);
  // console.log("PATH", path);
  // console.log("toursDataFile", toursDataFile);
  // const fileData = JSON.parse(fs.readFileSync(toursDataFile));
  // const updatedTours = tours.push(newData);
  // fs.writeFileSync(toursDataFile, JSON.stringify(fileData));
  fs.writeFile(toursDataFile, JSON.stringify(updatedTours), (err) => {
    if (err) {
      console.log("ERROR", err);
    }
  });
  console.log("TOURS", updatedTours);
});

module.exports = router;
