const { createUser } = require("./");
const client = require("./client");

// drop tables
async function dropTables() {
  try {
    console.log("Dropping All Tables...");
    await client.query(`
    DROP TABLE IF EXISTS cart_item CASCADE;
    DROP TABLE IF EXISTS order_items CASCADE;
    DROP TABLE IF EXISTS order_details CASCADE;
    DROP TABLE IF EXISTS product CASCADE;
    DROP TABLE IF EXISTS product_category CASCADE;
    DROP TABLE IF EXISTS product_inventory CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS discount CASCADE;
    DROP TABLE IF EXISTS user_address CASCADE;
    DROP TABLE IF EXISTS admin_type CASCADE;
    DROP TABLE IF EXISTS admin_user CASCADE;
    `);
  } catch (error) {
    throw error;
  }
}

// build tables
async function createTables() {
  try {
    console.log("Building All Tables...");
    // USERS TABLE & PRODUCT_CATEGORY TABLE
    await client.query(
      `
      CREATE TABLE users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        telephone CHARACTER(10),
        role_name VARCHAR(255) DEFAULT 'shopper' NOT NULL
        );
         CREATE TABLE product_category (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL
        );
        `
    );
    // DISCOUNT TABLE
    await client.query(`CREATE TABLE discount (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          discount_percent NUMERIC,
          isActive BOOLEAN);`);
    // PRODUCT TABLE
    await client.query(`CREATE TABLE product (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            description TEXT NOT NULL,
            category_id SERIAL REFERENCES product_category(id),
            price NUMERIC NOT NULL,
            discount_id SERIAL REFERENCES discount(id),
            product_image TEXT NOT NULL,
            quantity INTEGER NOT NULL
            );
        `);
    // USER_ADDRESS TABLE
    await client.query(`CREATE TABLE user_address(
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES users(id),
          address_line1 VARCHAR(255),
          address_line2 VARCHAR(255),
          city VARCHAR(255),
          postal_code VARCHAR(255),
          country VARCHAR(255));`);
    // ADMIN_TYPE TABLE
    await client.query(`CREATE TABLE admin_type (
          id SERIAL PRIMARY KEY,
          admin_type VARCHAR(255) UNIQUE,
          permissions VARCHAR(255) NOT NULL);`);
    // ADMIN_USER TABLE
    await client.query(`CREATE TABLE admin_user(
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          type_id SERIAL REFERENCES admin_type(id));`);
    // ORDER_ITEMS TABLE
    await client.query(`CREATE TABLE order_items(
          id SERIAL PRIMARY KEY,
          product_id SERIAL REFERENCES product(id) UNIQUE, user_id UUID REFERENCES users(id),
          quantity INTEGER NOT NULL);`);
  } catch (error) {
    throw error;
  }
}

// create initial data

async function createInitialUsers() {
  console.log("Starting to create users...");
  try {
    const createUsersArray = [
      {
        username: "mychaelm",
        password: "Marigold14",
        first_name: "Mychael",
        last_name: "Magnuson",
        telephone: 1112221212,
      },
      {
        username: "johnsmith12",
        password: "GoCowboys22",
        first_name: "John",
        last_name: "Smith",
        telephone: 2223331313,
      },
    ];

    const users = await Promise.all(createUsersArray.map(createUser));

    console.log("Users created: ");
    console.log(users);
    console.log("Finished creating users.");
  } catch (error) {
    console.log("Error creating users.");
    throw error;
  }
}
async function createInitialData() {
  try {
    console.log("Creating Initial Data...");
    // await client.query(`
    // INSERT INTO users (username, password, first_name, last_name, telephone)
    // VALUES
    //   ('mychaelm', 'Marigold14', 'Mychael', 'Magnuson', 1112221212),
    //   ('johnsmith12', 'GoCowboys22', 'John', 'Smith', 2223331313)`);
    await client.query(`INSERT INTO product_category (id, name)
    VALUES (
      1, 'lips'
    ), (2, 'face')`);
    await client.query(
      `INSERT INTO discount (name, description, discount_percent, isActive) VALUES ('REDFORDEAD', 'All red lipsticks are 30 percent off', .30, TRUE), ('PALETTELUV','All Palettes are 20 percent off', .20, TRUE)`
    );
    await client.query(`
      INSERT INTO product (name, description, category_id, price, product_image, quantity)
      VALUES
          ('Slip Shine Sheer Shiny Lipstick', 'The FENTY BEAUTY by Rihanna Slip Shine Sheer Shiny Lipstick 
          is an ultra comfortable sheer lipstick with the perfect amount of nourishing color and shine, available
           in a range of easy-to-wear shades for all.', 1, 26, 'https://media.ulta.com/i/ulta/2592337?w=720&fmt=webp', 245),
          ('Blue Blood Artistry Palette', 'The Blue Blood Palette contains 18 eyeshadow/pressed pigment shades of stunning blues,
           mints, and peaches. This palette is inspired by high-end jewelry boxes & caskets. Enclosed in a metal clasp, this trunk is
            one of a kind.', 2, 52, 'https://cdn.shopify.com/s/files/1/0673/2291/products/05BlueBlood-Open_Lid-Web.jpg?v=1629846255', 190)`);
    await client.query(
      `INSERT INTO admin_type (admin_type, permissions) VALUES ('super', 'create new products, delete products, edit products')`
    );
    await client.query(
      `INSERT INTO admin_user (username, password, first_name, last_name, type_id) VALUES ('mychaelmSuper','marigold14!!','Mychael','Magnuson', 1)`
    );
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
    await createInitialUsers();
    await createInitialData();
  } catch (error) {
    throw error;
  }
}

module.exports = {
  rebuildDB,
};
