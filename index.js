require("dotenv").config();
const express = require("express");
const app = express();
// const { PORT = 8080 } = process.env;
const PORT = process.env.PORT || 8080;
const chalk = require("chalk");

// init morgan
const morgan = require("morgan");
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = require("path");
app.use("/docs", express.static(path.join(__dirname, "public")));

// init body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// init cors
const cors = require("cors");
// app.use(
//   cors({
//     origin: "https://status-quo-e-commerce.netlify.app",
//   })
// );

app.use(
  cors({
    origin: "http://localhost:5173/"
  })
)

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.header("Access-Control-Allow-Header", "Content-Type");
  next();
});

// init db client
const client = require("./db/client");
client.connect();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Router: /api
app.use("/api", require("./api"));

app.get("/", (req, res) => {
  res.redirect("/docs");
});

app.get("*", (req, res) => {
  res.status(404).send({
    error: "404 - Not Found",
    message: "No route found for the requested URL",
  });
});

app.use((error, req, res, next) => {
  console.error("SERVER ERROR: ", error);
  if (res.statusCode < 400) res.status(500);
  res.send({
    error: error.message,
    name: error.name,
    message: error.message,
    table: error.table,
  });
});

app.listen(PORT, () => {
  console.log(
    chalk.blueBright("Server is listening on PORT:"),
    chalk.yellow(PORT)
  );
});
