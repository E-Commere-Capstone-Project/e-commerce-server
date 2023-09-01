const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
} = require("../db/products");
const { requireUser, requiredNotSent } = require("./utils");

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

// CREATE/POST = /api/products - add a new product
router.post(
  "/",
  requireUser,
  requiredNotSent({
    requiredParams: [
      "name",
      "description",
      "category_id",
      "price",
      "product_image",
    ],
  }),
  async (req, res, next) => {
    try {
      const { name, description, category_id, price, product_image } = req.body;
      const createdProduct = await createProduct(
        name,
        description,
        category_id,
        price,
        product_image
      );
      if (createdProduct) {
        res.send(createdProduct);
      } else {
        next({
          name: "FailedToCreate",
          message: "There was an error creating your product.",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
