const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  price: { type: Number, required: true },
  hours: { type: Number, required: true },
  rating: { type: Number, required: true },
  guided_tour: { type: Boolean, required: true },
  group_size: { type: String, required: true },
  entrance_fees_included: { type: Boolean, required: true },
  description: { type: String, required: true },
  image_url: { type: String, required: true },
  image_alt: { type: String, required: true },
});

module.exports = mongoose.model("Tour", tourSchema);
