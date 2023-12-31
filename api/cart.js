const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  emptyCart,
} = require("../db/cart");
// const { getProductById } = require("../db/products");
const { verifyToken } = require("./utils");

// GET = /api/cart - get all products in the cart
router.get("/", verifyToken, async (req, res, next) => {
  try {
    const { id } = req.user;
    const cart = await getCart(id);
    // console.log(req.body);
    // const cartItems = cart.map(async (product) => {
    //   const item = await getProductById(product.product_id);
    //   return item;
    // });

    res.send({
      status: {
        success: true,
        message: "Cart has been successfully received.",
      },
      cart,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
});

// POST = /api/cart add a product to the cart
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId, quantity } = req.body;
    const itemAdded = await addToCart(id, productId, quantity);
    // console.log(req);

    res.send({
      itemAdded,
      status: {
        success: true,
        message: "Item successfully added to your cart!",
      },
    });
  } catch (error) {
    next(error);
  }
});

// PATCH = /api/cart update a product in the cart
router.patch("/", verifyToken, async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId, quantity } = req.body;
    const itemUpdated = await updateCart(id, productId, quantity);

    res.send({
      itemUpdated,
      status: {
        success: true,
        message: "Item successfully updated!",
      },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart
router.delete("/", verifyToken, async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId } = req.body;
    const itemRemoved = await removeFromCart(id, productId);

    res.send({
      itemRemoved,
      status: {
        success: true,
        message: "Item has been removed from your cart.",
      },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/cart remove all items (empty out the cart)
router.delete("/", verifyToken, async (req, res, next) => {
  try {
    const { id } = req.user;
    const emptiedCart = await emptyCart(id);

    res.send({
      emptiedCart,
      status: { success: true, message: "Cart has been emptied successfully." },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
