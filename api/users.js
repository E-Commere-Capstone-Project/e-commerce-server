const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  createUser,
  getUserByUsername,
  getUser,
  getUserById,
} = require("../db/users");
const { verifyToken } = require("./utils");
require("dotenv").config();

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, first_name, last_name, telephone } = req.body;
    const queriedUser = await getUserByUsername(username);
    if (queriedUser) {
      res.status(401);
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    } else if (password.length < 8) {
      res.status(401);
      next({
        name: "PasswordLengthError",
        message: "Password Too Short!",
      });
    } else {
      const user = await createUser({
        username,
        password,
        first_name,
        last_name,
        telephone,
      });
      if (!user) {
        next({
          name: "UserCreationError",
          message: "There was a problem registering you. Please try again.",
        });
      } else {
        res.send({
          user,
          status: { success: true, message: "Thank you for signing up." },
        });
      }
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and a password",
      status: {success: false, message: 'Login has failed, please check username and password before trying again.'}
    });
  }

  try {
    const user = await getUser({ username, password });
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
        status: { success: true, message: "You have successfully logged in." },
        userToken: token,
        user_role: user.role_name,
      });
    }
  } catch (error) {
    next(error);
  }
});

//GET user by id
router.get("/account", verifyToken, async (req, res, next) => {
  const { id } = req.user;

  try {
    const userAccount = await getUserById(id);
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

  // jwt.verify(req.token, "secretkey", async (err, authData) => {
  //   if (err) {
  //     res.sendStatus(403);
  //   } else {
  //     const userAccount = await getUserById(userId);
  //     res.send({
  //       userAccount,
  //       status: {
  //         success: true,
  //         message: "Account is authenticated.",
  //       },
  //       userData: authData,
  //     });
  //   }
  // });
});

module.exports = router;
