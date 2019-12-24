const router = require("express").Router();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("../dbconfig");
const fs = require("fs");
const { auth } = require("../middleware/auth");
const {sqlexec} = require('../middleware/mysql');

const dir = "public/images/uploads/restaurant/"


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

router.get("/", (req, res) => {
  const query = "SELECT * FROM restaurant";

  mysql.execute(sql, [id_restaurant], sqlexec);
});

router.post('/addrestaurant', auth, upload.single("image") ,(req,res) => {
  const image = dir + req.file.filename;
   if (req.user.roles !== 'admin') {
      res.send({ success: false, msg: "we siapa lu" });
    fs.unlink(image, err => {
      if (err) throw err;
      console.log("successfully deleted " + image);
    });
    return;
   }
   const {name, x, y, desc} = req.body

   const sql ="INSERT INTO item (name, x, y, image, desc) VALUES (?,?,?,?,?)";

   mysql.execute(sql, [name, x, y, image, desc], sqlexec)
})

router.put('/changerestaurant/:id', auth, upload.single("image"), (req, res)=>{
   const image = dir + req.file.filename;
   if (req.user.roles !== 'admin') {
      res.send({ success: false, msg: "we siapa lu" });
    fs.unlink(image, err => {
      if (err) throw err;
      console.log("successfully deleted " + image);
    });
    return;
   }
   const {name, x, y, desc} = req.body

   const sql = "SESUATAU"

   mysql.execute(sql, [name, x, y, image, desc], sqlexec)

})

module.exports = router