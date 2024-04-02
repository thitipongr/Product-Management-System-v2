import express from "express";

let products = [];
let lastestId;

const productsRouter = express.Router();

export default productsRouter;

// POST request
productsRouter.route("/").post((req, res) => {
  if (
    !req.body.name ||
    !req.body.price ||
    isNaN(req.body.price) ||
    isNaN(req.body.stock)
  )
    // if นี้ สำหรับป้องกันไม่ให้ค่าที่จำเป็นถูกบันทึกเป็นค่าว่าง และส่วนที่เป็นตัวเลข ก็ต้องเป็นตัวเลขอย่างถูกต้อง
    return res.send("invalid body").status(204); // หากไม่เป็นไปตามกำหนด จะส่งข้อความว่า "invalid body" พร้อม status 204

  lastestId = lastestId ? lastestId : 0; // เช็คว่าเคยมีข้อมูลในระบบหรือไม่ ก่อนนำไปรวมเป็นก้อนใหม่

  // นำข้อมูลมารวมเป็นก้อนใหม่ ก่อนนำไปเก็บไว้ที่ตัวแปร product
  const newProduct = {
    id: lastestId + 1,
    name: String(req.body.name),
    category: String(req.body.category),
    price: Number(req.body.price),
    stock: Number(req.body.stock),
  };
  lastestId = newProduct.id;

  products.push(newProduct);
  res.json(newProduct); // ทำการส่ง Response กลับไป เมื่อจบการทำงาน
});

// GET request
productsRouter.route("/").get((req, res) => {
  if (products.length === 0)
    return res.status(404).send("There are no products yet."); // เช็คว่า มีข้อมูลในระบบหรือไม่ ถ้าไม่ก็ส่งข้อความ "There are no products yet." กลับ พร้อม status 404
  res.json(products); // หรือหากมีอยู่ ก็ให้แสดงออกไปทั้งหมด
});

productsRouter.route("/:id").get((req, res) => {
  // มีการรับ Params ชื่อ id เข้ามาด้วย
  const product = products.find((p) => p.id === parseInt(req.params.id)); // และนำมาเช็คว่า มีข้อมูลนั้น ๆ ไหม
  if (!product) return res.status(404).send("Product not found."); // ถ้าไม่มี ก็ส่งข้อความ "Product not found." กลับ พร้อม status 404
  res.json(product); // หรือหากมีอยู่ ก็ให้แสดงออกไปทั้งหมด
});

// PUT request
productsRouter.route("/:id").put((req, res) => {
  // มีการรับ Params ชื่อ id เข้ามาด้วย
  const product = products.find((p) => p.id === parseInt(req.params.id)); // และนำมาเช็คว่า มีข้อมูลนั้น ๆ ไหม
  if (!product) return res.status(404).send("Product not found."); // ถ้าไม่มี ก็ส่งข้อความ "Product not found." กลับ พร้อม status 404

  if (
    !req.body.name ||
    !req.body.price ||
    isNaN(req.body.price) ||
    isNaN(req.body.stock)
  )
    // if นี้ สำหรับป้องกันไม่ให้ค่าที่จำเป็นถูกบันทึกเป็นค่าว่าง และส่วนที่เป็นตัวเลข ก็ต้องเป็นตัวเลขอย่างถูกต้อง
    return res.send("invalid body").status(204); // หากไม่เป็นไปตามกำหนด จะส่งข้อความว่า "invalid body" พร้อม status 204

  product.name = String(req.body.name);
  product.category = String(req.body.category);
  product.price = Number(req.body.price);
  product.stock = Number(req.body.stock);
  // กำหนดค่าต่าง ๆ เป็นค่าใหม่

  res.json(product); // ทำการส่ง Response กลับไป เมื่อจบการทำงาน
});

// DELETE request
productsRouter.route("/:id").delete((req, res) => {
  // มีการรับ Params ชื่อ id เข้ามาด้วยเช่นเคย
  const productIndex = products.findIndex(
    (p) => p.id === parseInt(req.params.id)
  ); // และนำมาหา index ของข้อมูลนั้น ๆ
  if (productIndex === -1) return res.status(404).send("Product not found."); // ถ้าไม่มี ก็ส่งข้อความ "Product not found." กลับ พร้อม status 404

  const deletedProduct = products.splice(productIndex, 1); // หากพบ ก็จะทำการ splice ข้อมูลนั้น ๆ ออกไปจากระบบ
  res.json(deletedProduct); // ทำการส่ง Response กลับไป เมื่อจบการทำงาน
});
