const router = require("express").Router();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("../dbconfig");
const fs = require("fs");
const { auth } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");

const dir = "public/images/uploads/restaurant/";

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

router.get("/", (req, res) => {
  const sql = "SELECT * FROM restaurant";
  mysql.execute(sql, [], sqlexec(res, mysql));
});

router.post("/addrestaurant", auth('admin'), upload.single("image"), (req, res) => {
  const image = dir + req.file.filename;
  const { name, x, y, description } = req.body;

  const sql =
  `INSERT INTO restaurant (name,logo,longitude,latitude,description) VALUES (?,?,?,?,?)`;

  mysql.execute(sql, [name, image,x, y , description], sqlexec(res, mysql));
});

router.put("/changerestaurant/:id", auth('admin'),upload.single("image"),(req, res) => {
    const image = dir + req.file.filename;
    const { name, x, y, description } = req.body;
    const { id } = req.params;

    const sql =
      "UPDATE restaurant SET name=? ,longitude=?, latitude=?, logo=?,description=? WHERE id=?";

    mysql.execute(sql, [name, x, y, image, description, id], sqlexec(res, mysql));
  }
);

module.exports = router;
