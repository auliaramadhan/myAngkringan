const router = require("express").Router();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("../dbconfig");
const fs = require("fs");
const { auth } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");

const dir = "public/images/uploads/restaurant/";

var multer = require("multer");
var fileFilter = (req, file, callback) => {
  var ext = path.extname(file.originalname);
  if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'))
  }
  callback(null, true)
}
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  }
});
var upload = multer({ storage: storage, fileFilter });

router.get("/",auth(), (req, res) => {
  const sql = "SELECT * FROM restaurant";
  mysql.execute(sql, [], sqlexec(res, mysql));
});

router.post(
  "/",
  auth("admin"),
  upload.single("image"),
  (req, res) => {
    const image = dir + req.file.filename;
    let { name, lating, description } = req.body;
    lating = lating.split(",");
    try {
      const sql = `INSERT INTO restaurant (name,logo,longitude,latitude,description) VALUES (?,?,?,?,?)`;
      mysql.execute(
        sql,
        [name, image, lating[0], lating[1], description],
        sqlexec(res, mysql)
      );
    } catch (error) {
      fs.unlink(image);
      res.send({ success: false, msg: error });
    }
  }
);

router.put(
  "/:id",
  auth("admin"),
  upload.single("image"),
  (req, res) => {
    const image = dir + req.file.filename;
    let { name, lating, description } = req.body;
    const { id } = req.params;
    try {
      const sql =
        "UPDATE restaurant SET name=? ,longitude=?, latitude=?, logo=?,description=? WHERE id=?";

      mysql.execute(
        sql,[name, lating[0], lating[1], image, description, id],
        sqlexec(res, mysql)
      );
    } catch (error) {
      fs.unlink(image);
      res.send({ success: false, msg: error });
    }
  }
);

// router.delete("/:id", auth("admin"), upload.single("image"),(req, res) => {
//     const { id } = req.params;
//     try {
//       const sql =
//         "DELETE FROM restaurant WHERE id=?";

//       mysql.execute(
//         sql,[ id],
//         sqlexec(res, mysql)
//       );
//     } catch (error) {
//       console.log(error)
//     }
//   }
// );

module.exports = router;
