const client = require("./client.js");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

// CREATE/POST /api/users/register create new account
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
      INSERT INTO users (username, password, first_name, last_name, telephone) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (username) DO NOTHING RETURNING id, username
      `,
      [username, hashedPassword, first_name, last_name, telephone]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {
  // first get the user
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username = $1;
    `,
      [userName]
    );
    // if it doesn't exist, return null
    if (!rows || !rows.length) return null;
    // if it does:
    // delete the 'password' key from the returned object
    const [user] = rows;
    // delete user.password;
    return user;
  } catch (error) {
    console.error(error);
  }
}

// POST /api/users/login log in to an existing user account
async function getUser({ username, password }) {
  if (!username || !password) {
    return;
  }

  try {
    const user = await getUserByUsername(username);
    if (!user) return;
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordsMatch) return;
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}
// GET /api/users/me view logged in user account
async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`SELECT * FROM users WHERE id = $1;`, [userId]);
    if (!user) return null;
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}
// GET /api/users/:username/cart get the logged in user's cart
module.exports = {
  createUser,
  getUserByUsername,
  getUser,
  getUserById,
};
