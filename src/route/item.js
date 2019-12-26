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
    cb(null, file.fieldname + "-" + Date.now()+".jpg");
  }
});
var upload = multer({ storage: storage });

router.get("", (req, res) => {
  let { page, order } = req.query;
  console.log(req.query)
  order = order ? "item." + order :  "restaurant.id" ;
  page = page || 1;

  const sql = `SELECT item.id,item.name, item.price, item.image, item.rating, 
      item.created_on, item.updated_on, restaurant.name 
    FROM item JOIN restaurant on item.id_restaurant=restaurant.id
    ORDER BY ${order} LIMIT 10 OFFSET ${page*10-10} `;
    // console.log(sql)
    
    mysql.execute(sql, [], sqlexec(res, mysql));
  });
  

router.get("/search", (req, res) => {
  const { id_restaurant } = req.params;
  let { page, order, name, price, rating } = req.query;
  console.log(req.query)
  name = name ? ` item.name LIKE "%${name}%" ` : `item.name LIKE "%%"`;
  price = price ? ` item.price= "${price}"` : "";
  rating = rating ?  ` item.rating="${rating}" ` : "";
  order = order ? "item." + order : "restaurant.id";
  const AND = condition => (condition ? "AND" : "");
  let where = name || price || rating ? "WHERE" : "";
  page = page || 1

  // "SELECT * FROM item WHERE id_restaurant=?";
  const sql = 
  `SELECT item.id,item.name , item.price, item.image, item.rating, 
    item.created_on, item.updated_on, restaurant.name AS restauran
  FROM item JOIN restaurant on item.id_restaurant=restaurant.id ${where}
  ${name} ${AND(price) + price} ${AND(rating) + rating} 
  ORDER BY ${order} LIMIT 10 OFFSET ${page * 10 - 10}`;

  console.log(sql)

  mysql.execute(sql, [], sqlexec(res, mysql));
});

router.get("/:id_restaurant", (req, res) => {
  const { id_restaurant } = req.params;
  let { page, order } = req.query;
  console.log(req.query)
  order = order ? "item." + order :  "updated_on" ;
  page = page || 1;

  const sql = `SELECT * FROM item WHERE id_restaurant=? 
  ORDER BY ${order} LIMIT 10 OFFSET ${page*10-10}`;
  console.log(sql)

  mysql.execute(sql, [id_restaurant], sqlexec(res, mysql));
});


router.post("/additem", auth, upload.single("image"), (req, res) => {
  
  const image = dir + req.file.filename +".jpg";
  if (req.user.roles !== "manager") {
    res.send({ success: false, msg: "we siapa lu" });
    fs.unlink(image, err => {
      if (err) throw err;
      console.log("successfully deleted " + image);
    });
    return;
  }
  const {id_restaurant} = req.user;
  const { name, price, rating } = req.body;
  



  const sql =
    "INSERT INTO item (name, price, image, id_restaurant,rating) VALUES (?,?,?,?)";

  mysql.execute(sql, [name, price, image, id_restaurant, rating], sqlexec(res, mysql));
});

router.put("/changeitem/:id", auth, upload.single("image"), (req, res) => {
  console.log(req.file)
  const image = dir + req.file.filename;
  console.log(image)
  if (req.user.roles !== "manager") {
    res.send({ success: false, msg: "we siapa lu" });
    fs.unlink(image, err => {
      if (err) throw err;
      console.log("successfully deleted " + image);
    });
    return;
  }

  /*nanti ditambah buat gambar lama

   */

  const {id}= req.params;
  const { name, price } = req.body;

  const sql = "UPDATE item SET name=?, price=?, image=? WHERE id=?";

  mysql.execute(sql, [name, price, image, id], sqlexec(res, mysql));
});

router.delete("/removeitem/:id", auth, (req, res) => {
  if (req.user.roles !== "manager") {
    res.send({ success: false, msg: "we siapa lu" });
    return;
  }

  const {id_restaurant}  = req.user;
  const {id}  = req.params;
  const sql = `DELETE FROM item WHERE id=? AND id_restaurant=?`;

  mysql.execute(sql, [id,id_restaurant], sqlexec(res, mysql));
});

module.exports = router;
