const router = require("../api/products");
const client = require("./client");
const util = require("./util");

//GET = /api/products
async function getAllProducts() {
  try {
    const { rows: product } = await client.query(`SELECT * FROM product;`);
    return product;
  } catch (error) {
    throw error;
  }
}
// GET = /api/products/:id - get a single product by id
async function getProductById(id) {
  try {
    const {
      rows: [product],
    } = await client.query(`SELECT * FROM product WHERE id = $1;`, [id]);

    return product;
  } catch (error) {
    throw error;
  }
}

// CREATE/POST = /api/products - add a new product
async function createProduct({
  name,
  description,
  category_id,
  price,
  product_image,
}) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `INSERT INTO product ('name', 'description', 'category_id', 'price', 'product_image') VALUES($1, $2, $3, $4, $5) RETURNING *;`,
      [name, description, category_id, price, product_image]
    );

    return product;
  } catch (error) {
    throw error;
  }
}
// UPDATE/PATCH = /api/products/:id update/patch an existing product

// DELETE = /api/products/:id delete a product

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
};
