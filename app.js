import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// GET request
app.get("/products", (req, res) => {
  res.send("List of products");
});

// POST request
app.post("/products", (req, res) => {
  res.send("Add a new product");
});

// PUT request
app.put("/products/:id", (req, res) => {
  res.send(`Update product with ID: ${req.params.id}`);
});

// DELETE request
app.delete("/products/:id", (req, res) => {
  res.send(`Delete product with ID: ${req.params.id}`);
});

app.listen(port, () => {
  console.log(`Server running at <http://localhost>:${port}/`);
});
