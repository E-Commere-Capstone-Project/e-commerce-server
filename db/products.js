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

// UPDATE/PATCH = /api/products/:id update/patch an existing product

// DELETE = /api/products/:id delete a product

module.exports = {
  getAllProducts,
  getProductById,
};
