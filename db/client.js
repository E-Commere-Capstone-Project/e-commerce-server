const { Client } = require("pg");

const connectionString =
  process.env.DATABASE_URL || "https://localhost:5432/e-commerce";

const client = new Client({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

module.exports = client;
