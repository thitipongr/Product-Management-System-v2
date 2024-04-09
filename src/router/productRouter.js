import express from "express";
import mysql from "mysql";
import db_config from "./../../db_config.json" assert { type: "json" };
const productsRouter = express.Router();

export default productsRouter;

const con = mysql.createConnection({
  host: db_config.host,
  port: db_config.port,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
}); // เชื่อมต่อฐานข้อมูลด้วยข้อมูลที่เตรียมไว้ที่ File db_config

con.connect((err) => {
  if (err) throw err;
  console.log("Database Connected!");
}); // ตรวจสอบการเชื่อมต่อฐานข้อมูล

let lastestId;
const getLastId_sql = "SELECT id FROM products ORDER BY id DESC LIMIT 1"; // เตรียม SQL สำหรับเรียกรับข้อมูล id ของ product
con.query(getLastId_sql, (err, result) => {
  if (err) throw err;
  lastestId = result[0]?.id ? result[0].id : 0;
}); // เรียกขอ และนำข้อมูล id ของ product ล่าสุดมาเก็บเบื่องต้นไว้ที่ lastestId

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

  // นำข้อมูลมารวมเป็นก้อนใหม่ ก่อนนำไปเก็บไว้ที่ตัวแปร product
  const newProduct = {
    id: lastestId + 1,
    name: String(req.body.name),
    category: String(req.body.category),
    price: Number(req.body.price),
    stock: Number(req.body.stock),
  };

  const insertNewProduct_sql = `INSERT INTO products (id, name, category, price, stock) VALUES (${newProduct.id}, "${newProduct.name}", "${newProduct.category}",${newProduct.price},${newProduct.stock})`; // เตรียม SQL สำหรับการเพิ่มสินค้าใหม่ จากข้อมูลที่เตรียมไว้

  con.query(insertNewProduct_sql, (err, result) => {
    if (err) throw res.send(err).status(204);
  }); // เรียกใช้ SQL สำหรับการเพิ่มสินค้าใหม่

  lastestId = newProduct.id; // นำข้อมูล id ล่าสุดที่ถูกบันทึก มาเก็บไว้ใช้ในการเพิ่มข้อมูลรายการต่อไป

  res.json(newProduct); // ทำการส่ง Response กลับไป เมื่อจบการทำงาน
});

// GET request
productsRouter.route("").get((req, res) => {
  const { page = 1, limit = 10 } = req.query; // รายการข้อมูล page และ limit ไว้ โดยกำหนดค่าเริ่มต้นที่ 1 และ 10 ตามลำดับ
  const findWithPage_sql = `SELECT * FROM products LIMIT ${limit} OFFSET ${
    page * limit - limit
  }`; // เตรียม SQL สำหรับการเรียกดูกลุ่มข้อมูลสินค้าตาม page และ limit ที่กำหนดไว้
  con.query(findWithPage_sql, (err, result) => {
    if (err) throw err;

    if (result.length === 0)
      return res.send("There are no products here.").status(204); // หากไม่มี ก็แสดงข้อความแจ้ง

    res.json(result);
  }); // เรียกใช้ SQL สำหรับการเรียกดูกลุ่มข้อมูลสินค้า
});

productsRouter.route("/:id").get((req, res) => {
  const { id } = req.params;
  const fineById = `SELECT * FROM products WHERE id = ${id}`; // เตรียม SQL สำหรับการเรียกดูข้อมูลสินค้าตาม id ที่กำหนดไว้
  con.query(fineById, (err, result) => {
    if (err) throw err;

    if (result.length === 0) return res.send("Product not found.").status(204); // หากไม่มี ก็แสดงข้อความแจ้ง

    res.json(result);
  });
});

// PUT request
productsRouter.route("/:id").put((req, res) => {
  const { id } = req.params;
  const fineById = `SELECT * FROM products WHERE id = ${id}`; // เตรียม SQL สำหรับการเรียกดูข้อมูลสินค้าตาม id ที่กำหนดไว้
  con.query(fineById, (err, findIdResult) => {
    if (err) throw err;

    if (findIdResult.length === 0)
      return res.send("Product not found.").status(204); // หากไม่มี ก็แสดงข้อความแจ้ง

    const oldData = findIdResult[0];

    const packData = `name = "${req.body.name || oldData.name}", category = "${
      req.body.category || oldData.category
    }", price = ${req.body.price || oldData.price}, stock = ${
      req.body.stock || oldData.stock
    }`; // กำหนดให้ หากนำเข้าข้อมูลว่างเปล่า ให้บันทึกเป็นข้อมูลเดิม

    const updateProduct_sql = `UPDATE products SET ${packData} WHERE id = "${oldData.id}"`; // เตรียม SQL สำหรับการแก้ไขข้อมูลตามที่กำหนด
    con.query(updateProduct_sql, (err) => {
      if (err) throw err;
      res.json({
        name: req.body.name || oldData.name,
        category: req.body.category || oldData.category,
        price: req.body.price || oldData.price,
        stock: req.body.stock || oldData.stock,
      });
    });
  });
});

// DELETE request
productsRouter.route("/:id").delete((req, res) => {
  const { id } = req.params;
  const fineById = `SELECT * FROM products WHERE id = ${id}`; // เตรียม SQL สำหรับการเรียกดูข้อมูลสินค้าตาม id ที่กำหนดไว้
  con.query(fineById, (err, findIdResult) => {
    if (err) throw err;

    if (findIdResult.length === 0)
      return res.send("Product not found.").status(204); // หากไม่มี ก็แสดงข้อความแจ้ง

    const deletedProduct = findIdResult[0];
    const deleteProduct_sql = `DELETE FROM products WHERE id = ${id}`; // เตรียม SQL สำหรับการลบข้อมูลตาม id ที่กำหนด
    con.query(deleteProduct_sql, (err) => {
      if (err) throw err;
      res.json(deletedProduct);
    });
  });
});
