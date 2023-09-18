const express = require("express");
const router = express.Router();

// ROUTER: /api/users
router.use("/users", require("./users"));

// ROUTER: /api/products
router.use("/products", require("./products"));

// ROUTER: /api/cart
router.use("/cart", require("./cart"));

module.exports = router;
