require("dotenv").config();
const router = require("express").Router();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("../dbconfig");
const fs = require("fs");
const { auth } = require("../middleware/auth");

var multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  }
});
var upload = multer({ storage: storage });

router.get("/", (req, res) => { 
   const query = "SELECT * FROM item JOIN restauran where item.id_restaurant=restaurant.id";
 
   mysql.execute(sql, [id_restaurant], (err, result, field) => {
     res.send(field);
   });
 });
 

router.get("/:id_restaurant", (req, res) => {
  const { id_restaurant } = req.params;

  const query = "SELECT * FROM item WHERE id_restaurant=?";

  mysql.execute(sql, [id_restaurant], (err, result, field) => {
    res.send(field);
  });
});

router.post("/additem", auth, upload.single("image"), (req, res) => {
  const image = "public/images/uploads/item/" + req.file.filename;
  if (req.user !== "manager") {
    res.send({ success: false, msg: "we siapa lu" });
    fs.unlink(image, err => {
      if (err) throw err;
      console.log("successfully deleted " + image);
    });
    return;
  }
  const [id_restaurant] = req.user
  const { name, price } = req.body;

  const sql =
    "INSERT INTO item (name, price, image, id_restaurant) VALUES (?,?,?,?)";

  mysql.execute(
    sql,
    [name, price, image, id_restaurant],
    (err, result, field) => {
      res.send(field);
    }
  );
});

router.put("/changeitem/:id", auth, upload.single("image"), (req, res) => {
   const image = "public/images/uploads/item/" + req.file.filename;
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
 
   const query =
     "UPDATE item SET name=?, price=?, image=? WHERE id=?";

   mysql.execute(
     sql,
     [name, price, image, id],
     (err, result, field) => {
       res.send(field);
     }
   );
 });

router.delete("/removeitem", auth, (req, res) => {
  if (req.user !== "manager") {
    res.send({ success: false, msg: "we siapa lu" });
    return;
  }
  const { id } = req.body;
  const sql = `DELETE item WHERE id=?`;

  mysql.execute(sql, [id], (err, result, field) => {
    console.log(err);
    res.send(result);
  });
});

module.exports = router;
