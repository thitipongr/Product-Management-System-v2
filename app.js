import express from "express";
import debug from "debug";
import morgan from "morgan";
import bodyParser from "body-parser";
import productsRouter from "./src/router/productRouter.js";
import mysql from "mysql";
import db_config from "./db_config.json" with { type: "json" };

const app = express();
const PORT = process.env.PORT;

app.use(morgan("combined"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to Product management system");
});

app.use("/products", productsRouter);

app.listen(PORT, () => {
  debug(`Server running at <http://localhost:${PORT}>`);
});

const con = mysql.createConnection({
  host: db_config.host,
  port: db_config.port,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
});
