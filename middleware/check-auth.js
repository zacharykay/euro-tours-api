const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  // Stop Option request from being blocked and allow for error stating Access to fetch CORS policy preflight response
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed");
    }

    // Verify token created for user by jsonwebtoken using same npm package from users-controllers
    // returns payload that was encoded into token
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    // userId added to token's payload when created in users-controllers
    req.userData = { userId: decodedToken.userId };

    next();
  } catch (err) {
    const error = new HttpError("Authentication failed", 403);
    return next(error);
  }
};
