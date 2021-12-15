const express = require("express");

const router = express.Router();

const tours = require("../../api/Tours");

const CORSAllow = process.env.CORS || "*";

router.get("/", (req, res) =>
  res.header("Access-Control-Allow-Origin", CORSAllow).json(tours)
);

module.exports = router;
