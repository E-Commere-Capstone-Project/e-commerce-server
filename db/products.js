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

module.exports = {
  getAllProducts,
};
