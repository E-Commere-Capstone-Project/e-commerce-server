const client = require("./client");

// GET all items in the cart
async function getCart(userId) {
  try {
    // const { rows: order_items } = await client.query(
    //   `SELECT * FROM order_items WHERE user_id = $1`,
    //   [userId]
    // );
    const { rows: order_items } = await client.query(
      `SELECT name, price, discount_id, product_image, oi.quantity AS order_quantity FROM order_items oi INNER JOIN product p ON oi.product_id = p.id WHERE oi.user_id = $1`,
      [userId]
    );

    // console.log(`Checking cart: `, await checkInCart(userId, 1));

    return order_items;
  } catch (error) {
    throw error;
  }
}

async function checkInCart(userId, productId) {
  try {
    const {
      rows: [order_items],
    } = await client.query(
      `SELECT * FROM order_items WHERE user_id = $1 AND product_id = $2`,
      [userId, productId]
    );
    return order_items;
  } catch (error) {
    throw error;
  }
}

// POST add items to the cart
async function addToCart(userId, productId, quantity) {
  try {
    // select an item from the products and simulate adding it to the cart
    // realistically this function would only happen on the products route
    // get product by id, create a new order_items row by inserting the product id, the cart id taken from the order_details and passing a quantity
    // console.log(`Checking cart: `, checkInCart(userId, productId));
    const ifInCart = await checkInCart(userId, productId);

    if (ifInCart) {
      return;
    } else {
      const {
        rows: [order_items],
      } = await client.query(
        `INSERT INTO order_items ("product_id", "user_id", "quantity") VALUES ($1, $2, $3) RETURNING *;`,
        [productId, userId, quantity]
      );
      return order_items;
    }

    // return order_items;
  } catch (error) {
    throw error;
  }
}

// PATCH to change order quantity
async function updateCart(userId, productId, quantity) {
  try {
    const ifInCart = await checkInCart(userId, productId);

    if (ifInCart) {
      const {
        rows: [order_items],
      } = await client.query(
        `UPDATE order_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3;`,
        [quantity, userId, productId]
      );
      return order_items;
    } else {
      return;
    }
  } catch (error) {
    throw error;
  }
}

async function removeFromCart(userId, productId) {
  try {
    const ifInCart = await checkInCart(userId, productId);

    if (ifInCart) {
      const {
        rows: [order_items],
      } = await client.query(
        `DELETE FROM order_items WHERE user_id = $1 AND product_id = $2 RETURNING *;`,
        [userId, productId]
      );
      return order_items;
    }
  } catch (error) {
    throw error;
  }
}

async function emptyCart(userId) {
  try {
    const {
      rows: [order_items],
    } = await client.query(
      `DELETE FROM order_items WHERE user_id = $1 RETURNING *;`,
      [userId]
    );
    return order_items;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  emptyCart,
};
