const { createUser } = require("./");
const client = require("./client");

// drop tables
async function dropTables() {
  try {
    console.log("Dropping All Tables...");
    await client.query(`
    DROP TABLE IF EXISTS product CASCADE;
    DROP TABLE IF EXISTS product_category CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    `);
  } catch (error) {
    throw error;
  }
}

// build tables
async function createTables() {
  try {
    console.log("Building All Tables...");
    await client.query(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        telephone CHARACTER(10)
        );CREATE TABLE product_category (
          id INTEGER PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL
        );
        CREATE TABLE product (
            id INTEGER PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            description TEXT NOT NULL,
            category_id INTEGER REFERENCES product_category(id),
            inventory_id INTEGER,
            price NUMERIC NOT NULL,
            discount_id INTEGER,
            product_image BYTEA NOT NULL
            );
        
        `);
  } catch (error) {
    throw error;
  }
}

// create initial data

// async function createInitialUsers() {
//   console.log("Starting to create users...");
//   try {
//     const createUsersArray = [
//       {
//         username: "mychaelm",
//         password: "Marigold14",
//         first_name: "Mychael",
//         last_name: "Magnuson",
//         telephone: 1112221212,
//       },
//       {
//         username: "johnsmith12",
//         password: "GoCowboys22",
//         first_name: "John",
//         last_name: "Smith",
//         telephone: 2223331313,
//       },
//     ];

//     const users = await Promise.all(createUsersArray.map(createUser));

//     console.log("Users created: ");
//     console.log(users);
//     console.log("Finished creating users.");
//   } catch (error) {
//     console.log("Error creating users.");
//     throw error;
//   }
// }
async function createInitialData() {
  try {
    console.log("Creating Initial Data...");
    // await client.query(`
    // INSERT INTO users (username, password, first_name, last_name, telephone)
    // VALUES
    //   ('mychaelm', 'Marigold14', 'Mychael', 'Magnuson', 1112221212)
    //   ('johnsmith12', 'GoCowboys22', 'John', 'Smith', 2223331313)`);

    await client.query(`INSERT INTO product_category (id, name)
    VALUES (
      1, 'lips'
    ), (2, 'face')`);
    await client.query(`
      INSERT INTO product (id, name, description, category_id, inventory_id, price, discount_id, product_image)
      VALUES
          (1, 'Slip Shine Sheer Shiny Lipstick', 'The FENTY BEAUTY by Rihanna Slip Shine Sheer Shiny Lipstick 
          is an ultra comfortable sheer lipstick with the perfect amount of nourishing color and shine, available
           in a range of easy-to-wear shades for all.', 1, 1, 26, null, 'https://media.ulta.com/i/ulta/2592337?w=720&fmt=webp'),
          (2, 'Blue Blood Artistry Palette', 'The Blue Blood Palette contains 18 eyeshadow/pressed pigment shades of stunning blues,
           mints, and peaches. This palette is inspired by high-end jewelry boxes & caskets. Enclosed in a metal clasp, this trunk is
            one of a kind.', 2, 2, 52, null, 'https://cdn.shopify.com/s/files/1/0673/2291/products/05BlueBlood-Open_Lid-Web.jpg?v=1629846255')`);
  } catch (error) {
    throw error;
  }
}

// build all tables and create initial data
async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    // await createInitialUsers();
    await createInitialData();
  } catch (error) {
    throw error;
  }
}

module.exports = {
  rebuildDB,
};
