const express = require("express");
const router = express.Router();

// ROUTER: /api/products
router.use("/products", require("./products"));

module.exports = router;
