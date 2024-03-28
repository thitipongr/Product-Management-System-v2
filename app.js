import express from "express";
import debug from "debug";
import morgan from "morgan";
import bodyParser from "body-parser";
import productsRouter from "./src/router/productRouter.js";

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
