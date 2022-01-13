const fs = require("fs");
const path = require("path");

const express = require("express");
const router = express.Router();

const Tour = require("../../models/tours");

// const CORSAllow = process.env.CORS;

// Get All Tours
router.get("/", async (req, res) => {
  try {
    const tours = await Tour.find();
    res
      .header("Access-Control-Allow-Origin", "https://eurotours.netlify.app")
      .json(tours);
  } catch (err) {
    res.status(500).json({ message: err.message, notification: "Server Error" });
  }
});

// Get One Tour
router.get("/:id", getTour, async (req, res) => {
  res.json(res.tour);
});

// Create One Tour
router.post("/", async (req, res) => {
  const body = req.body;
  const tour = new Tour({
    name: body.name,
    city: body.city,
    country: body.country,
    price: body.price * 100,
    hours: body.hours,
    rating: body.rating,
    guided_tour: body.guided_tour,
    group_size: body.group_size,
    entrance_fees_included: body.entrance_fees_included,
    description: body.description,
    image_url: body.image_url,
    image_alt: body.image_alt,
  });
  try {
    const newTour = await tour.save();
    // Status 201 means created/posted successfully
    res.status(201).json(newTour);
  } catch (err) {
    // User input error
    res.status(400).json({ message: err.message });
  }
});

// Update One Tour
router.patch("/:id", getTour, async (req, res) => {
  const body = req.body;

  try {
    if (Object.keys(body).length === 0 && body.constructor === Object) {
      throw { notification: "No edits detected" };
    }

    const tourKeys = Object.keys(res.tour._doc);
    const bodyKeys = Object.keys(body);
    const bodyValues = Object.values(body);

    bodyKeys.map((key, index) => {
      // Check to make sure no new keys are being added to database schema
      const matchingKey = tourKeys.includes(key);
      if (!matchingKey) {
        throw {
          notification: `Mismatching data detected, specified key "${key}" does not exist in database schema`,
        };
      }
      if (key === "price" && res.tour[key] !== bodyValues[index] * 100) {
        bodyValues[index] = bodyValues[index] * 100;
      }

      res.tour[key] = bodyValues[index];
    });

    const updatedTour = await res.tour.save();
    res.json(updatedTour);
  } catch (err) {
    res.status(400).json({ message: err.notification });
  }
});

// Delete One Tour
router.delete("/:id", getTour, async (req, res) => {
  try {
    await res.tour.remove();
    res.json({ message: `Tour ${res.tour.name} was Deleted` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// getTour Middleware Function to test if id exists in database, throwing error if not
async function getTour(req, res, next) {
  console.log("BODY", req.body);
  let tour;
  try {
    try {
      tour = await Tour.findById(req.params.id);
      if (tour === null) {
        return res
          .status(404)
          .json({ message: `Cannot find tour with specified id ${req.params.id}` });
      }
    } catch (err) {
      return res
        .status(404)
        .json({ message: `Cannot find tour with specified id ${req.params.id}` });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.tour = tour;
  next();
}

module.exports = router;
