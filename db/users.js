const client = require("./client.js");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

async function createUser({
  username,
  password,
  first_name,
  last_name,
  telephone,
}) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password, first_name, last_name, telephone) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (username) DO NOTHING RETURNING id, username
      `,
      [username, hashedPassword, first_name, last_name, telephone]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
};
