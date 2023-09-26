const { Client } = require("pg");
require("dotenv").config();

const connectionString = process.env.DB_URL || "https://localhost:5432/server";

const client = new Client({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

module.exports = client;
