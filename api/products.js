const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../db/products");
const { requireUser, requiredNotSent } = require("./utils");

// GET = /api/products - get all products
router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    console.log(req);

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
      const createdProduct = await createProduct(req.body);
      if (createdProduct) {
        console.log(req);
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

// UPDATE /api/products/:id
router.patch(
  "/:id",
  requiredNotSent({ requiredParams: ["name", "price"], atLeastOne: true }),
  async (req, res, next) => {
    try {
      const { name, description, category_id, price, product_image } = req.body;
      const { id } = req.params;
      const productToUpdate = await getProductById(id);
      if (!productToUpdate) {
        next({
          name: "Product no found",
          message: "No product by ID ${id}",
        });
      } else {
        const updatedProduct = await updateProduct({
          id,
          name,
          description,
          category_id,
          price,
          product_image,
        });
        if (updatedProduct) {
          res.send(updatedProduct);
        } else {
          next({
            name: "FailedToUpdate",
            message: "There was an error updating your routine",
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

// DELETE product /products/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const productToDelete = await getProductById(id);
    if (!productToDelete) {
      next({
        name: "NotFound",
        message: `No product by ID ${id}`,
      });
    } else {
      const deletedProduct = await deleteProduct(id);
      res.send({ success: true, ...deletedProduct });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
