const client = require("./client.js");
const bcrypt = require("bcrypt");

// Log in as the admin
async function getAdminUserByUsername(userName) {
  // first get the user
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM admin_user
      WHERE username = $1;
    `,
      [userName]
    );
    // if it doesn't exist, return null
    if (!rows || !rows.length) return null;
    // if it does:
    // delete the 'password' key from the returned object
    const [admin_user] = rows;
    // delete user.password;
    return admin_user;
  } catch (error) {
    console.error(error);
  }
}

// POST /api/adminUser/login log in to an existing user account
async function getAdminUser(username, password) {
  if (!username || !password) {
    return;
  }

  try {
    const user = await getAdminUserByUsername(username);
    if (!user) return;
    // const hashedPassword = user.password;
    // const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    // if (!passwordsMatch) return;
    // delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

// GET /api/adminUser/me view logged in user account
async function getAdminUserById(userId) {
  try {
    const {
      rows: [admin_user],
    } = await client.query(`SELECT * FROM admin_user WHERE id = $1;`, [userId]);
    if (!admin_user) return null;
    delete admin_user.password;
    return admin_user;
  } catch (error) {
    throw error;
  }
}
// GET /api/users/:username/cart get the logged in user's cart
module.exports = {
  getAdminUser,
  getAdminUserByUsername,
  getAdminUserById,
};
