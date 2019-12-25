require("dotenv").config();
const router = require("express").Router();
const mysql = require("../dbconfig");
const fs = require("fs");
const { auth } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");

const dir = "public/images/uploads/item/";

var multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  }
});
var upload = multer({ storage: storage });

router.get("", (req, res) => {
  let { page, order } = req.query;
  order = order? "restauran.id" : "item."+order
  page = page || 0

  const sql = `SELECT (item.id,item.name, item.price, item.image, item.rating, 
      item.created_on, item.updated_on, restaurant.name) 
    FROM item JOIN restauran on item.id_restaurant=restaurant.id 
    ORDER BY ${order} LIMIT 10 OFFSET ${page * 10}`;

  mysql.execute(sql, [id_restaurant], sqlexec(res, mysql));
});

router.get("/search", (req, res) => {
  const { id_restaurant } = req.params;
  let { page, order, name, price, rating } = req.query;
  name = name ? " item.name="+ name : ""
  price = price ? " item.price="+ price : ""
  rating = rating ? " item.rating="+ rating : ""
  order = order? "restauran.id" : "item."+order
  const AND = (condition) => condition ? "AND" : ""
  let where = name || price || rating ? "WHERE" : "";
  page = page || 0

  const query = "SELECT * FROM item WHERE id_restaurant=?";
  `SELECT (item.id,item.name, item.price, item.image, item.rating, 
    item.created_on, item.updated_on, restaurant.name) 
  FROM item JOIN restauran on item.id_restaurant=restaurant.id ${where}
  ${AND(price)+name} ${AND(price)+price} ${AND(price)+rating} 
  ORDER BY ${order} LIMIT 10 OFFSET ${page * 10}`;

  mysql.execute(sql, [id_restaurant], sqlexec(res, mysql));
});

router.get("/:id_restaurant", (req, res) => {
  const { id_restaurant } = req.params;

  const query = "SELECT * FROM item WHERE id_restaurant=?";

  mysql.execute(sql, [id_restaurant], sqlexec(res, mysql));
});

router.post("/additem", auth, upload.single("image"), (req, res) => {
  const image = dir + req.file.filename;
  if (req.user !== "manager") {
    res.send({ success: false, msg: "we siapa lu" });
    fs.unlink(image, err => {
      if (err) throw err;
      console.log("successfully deleted " + image);
    });
    return;
  }
  const [id_restaurant] = req.user;
  const { name, price } = req.body;

  const sql =
    "INSERT INTO item (name, price, image, id_restaurant) VALUES (?,?,?,?)";

  mysql.execute(sql, [name, price, image, id_restaurant], sqlexec(res, mysql));
});

router.put("/changeitem/:id", auth, upload.single("image"), (req, res) => {
  const image = dir + req.file.filename;
  if (req.user !== "manager") {
    res.send({ success: false, msg: "we siapa lu" });
    fs.unlink(image, err => {
      if (err) throw err;
      console.log("successfully deleted " + image);
    });
    return;
  }

  /*nanti ditambah buat gambar lama

   */

  const [id] = req.params;
  const { name, price } = req.body;

  const query = "UPDATE item SET name=?, price=?, image=? WHERE id=?";

  mysql.execute(sql, [name, price, image, id], sqlexec(res, mysql));
});

router.delete("/removeitem", auth, (req, res) => {
  if (req.user !== "manager") {
    res.send({ success: false, msg: "we siapa lu" });
    return;
  }
  const { id } = req.body;
  const sql = `DELETE item WHERE id=?`;

  mysql.execute(sql, [id], sqlexec(res, mysql));
});

module.exports = router;
