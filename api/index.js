const express = require("express");
const router = express.Router();

// ROUTER: /api/users
router.use("/users", require("./users"));

// ROUTER: /api/products
router.use("/products", require("./products"));

module.exports = router;
