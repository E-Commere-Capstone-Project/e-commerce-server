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
    // const {
    //   rows: [product],
    // } = await client.query(`SELECT * FROM product WHERE id = $1;`, [id]);
    const {
      rows: [product],
    } = await client.query(
      `SELECT p.name, p.description, pCat.name AS category, p.price, p.product_image, p.quantity FROM product p INNER JOIN product_category pCat ON p.category_id = pCat.id WHERE p.id = $1;`,
      [id]
    );

    return product;
  } catch (error) {
    throw error;
  }
}

// CREATE/POST = /api/products - add a new product
async function createProduct(body) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `INSERT INTO product ("name", "description", "category_id", "price","product_image", "quantity") VALUES($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [
        body.name,
        body.description,
        body.category_id,
        body.price,
        body.product_image,
        body.quantity,
      ]
    );

    return product;
  } catch (error) {
    throw error;
  }
}
// UPDATE/PATCH = /api/products/:id update/patch an existing product
async function updateProduct({ id, ...fields }) {
  try {
    const toUpdate = {};
    for (let column in fields) {
      if (fields[column] !== undefined) toUpdate[column] = fields[column];
    }
    let product;
    if (util.dbFields(toUpdate).insert.length > 0) {
      const { rows } = await client.query(
        `UPDATE product SET ${
          util.dbFields(toUpdate).insert
        } WHERE id=${id} RETURNING *;`,
        Object.values(toUpdate)
      );
      product = rows[0];
    }
    return product;
  } catch (error) {
    throw error;
  }
}
// DELETE = /api/products/:id delete a product
async function deleteProduct(id) {
  try {
    const {
      rows: [product],
    } = await client.query(`DELETE FROM product WHERE id = $1 RETURNING *;`, [
      id,
    ]);
    return product;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
