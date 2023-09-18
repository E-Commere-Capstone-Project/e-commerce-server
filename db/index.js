module.exports = {
  // ...require('./client'), // adds key/values from users.js
  ...require("./users"), // adds key/values from users.js
  ...require("./products"),
  ...require("./product_categories.js"), // etc
  ...require("./cart"),
};
