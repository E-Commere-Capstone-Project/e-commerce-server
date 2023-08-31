const express = require("express");
const router = express.Router();

const { getAllProducts, getProductById } = require("../db/products");

// GET = /api/products - get all products
router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();

    res.send(products);
  } catch (error) {
    next(error);
  }
});

// GET = /api/products/:id - get a single product by id
router.get("/:id", async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);

    res.send(product);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
