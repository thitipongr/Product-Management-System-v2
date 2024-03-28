import express from "express";
let products = [];

const productsRouter = express.Router();

// POST request
productsRouter.route("/").post((req, res) => {
  const newProduct = {
    id: Number(products.length ? products.at(-1).id : 0) + 1,
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    stock: req.body.stock,
  };
  products.push(newProduct);
  res.json(newProduct);
});

// GET request
productsRouter.route("/").get((req, res) => {
  if (products.length === 0)
    return res.status(404).send("There are no products yet.");
  res.json(products);
});

productsRouter.route("/:id").get((req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send("Product not found.");
  res.json(product);
});

// PUT request
productsRouter.route("/:id").put((req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send("Product not found.");

  product.name = req.body.name;
  product.category = req.body.category;
  product.price = req.body.price;
  product.stock = req.body.stock;

  res.json(product);
});

// DELETE request
productsRouter.route("/:id").delete((req, res) => {
  const productIndex = products.findIndex(
    (p) => p.id === parseInt(req.params.id)
  );
  if (productIndex === -1) return res.status(404).send("Product not found.");

  const deletedProduct = products.splice(productIndex, 1);
  res.json(deletedProduct);
});

export default productsRouter;
