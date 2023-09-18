const jwt = require("jsonwebtoken");
require("dotenv").config();

function requireUser(req, res, next) {
  if (!req.user) {
    res.status(401);
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }

  next();
}

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// takes required parameters as an array, returns a middleware function that sends back a message if they're not present
const requiredNotSent = ({ requiredParams, atLeastOne = false }) => {
  return (req, res, next) => {
    // for operations that need at least one param. Not all required.
    if (atLeastOne) {
      let numParamsFound = 0;
      for (let param of requiredParams) {
        if (req.body[param] !== undefined) {
          numParamsFound++;
        }
      }
      if (!numParamsFound) {
        next({
          name: "MissingParams",
          message: `Must provide at least one of these in body: ${requiredParams.join(
            ", "
          )}`,
        });
      } else {
        next();
      }
    } else {
      // figure out which ones are not defined, and return them
      const notSent = [];
      for (let param of requiredParams) {
        if (req.body[param] === undefined) {
          notSent.push(param);
        }
      }
      if (notSent.length)
        next({
          name: "MissingParams",
          message: `Required Parameters not sent in body: ${notSent.join(
            ", "
          )}`,
        });
      next();
    }
  };
};

module.exports = {
  requireUser,
  requiredNotSent,
  verifyToken,
};
