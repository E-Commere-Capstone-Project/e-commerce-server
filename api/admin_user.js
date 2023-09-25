const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { verifyToken } = require("./utils");
require("dotenv").config();

const { getAdminUser, getAdminUserById } = require("../db/admin_user");

// POST /api/admin users/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and a password",
    });
  }

  try {
    const user = await getAdminUser(username, password);
    if (!user) {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    } else {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1w" }
      );
      res.send({
        user,
        status: {
          success: true,
          message: "You have successfully logged in.",
        },
        userToken: token,
        user_role: user.role_name,
      });
    }
  } catch (error) {
    next(error);
  }
});

//GET admin user by id
router.get("/account", verifyToken, async (req, res, next) => {
  const { id } = req.user;

  try {
    const userAccount = await getAdminUserById(id);
    res.send({
      userAccount,
      status: {
        success: true,
        message: "Account is authenticated.",
      },
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
