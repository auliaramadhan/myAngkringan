require("dotenv").config();
const router = require("express").Router();
const mysql = require("../dbconfig");
const { auth } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");


var multer = require("multer");
var fileFilter = (req, file, callback) => {
  var ext = file.originalname.split(".").pop();
  if (ext !== "png" && ext !== "jpg" && ext !== "gif" && ext !== "jpeg") {
    return callback("Only images are allowed");
  }
  callback(null, true);
};
const dir = "/images/uploads/user/";
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public' + dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  }
});
var upload = multer({ storage: storage, fileFilter });



router.get("",auth([]),  (req, res) => {
  const { id } = req.user;
  const sql = `SELECT * FROM user_profile where id_user=?`;

  mysql.execute(sql, [id], sqlexec(res, mysql));
});

router.post("/", auth([]), (req, res) => {
  let { first_name, last_name, address, phone, city_of_birth, date_of_birth,zip_code,  } = req.body;
  const { id } = req.user;
  date_of_birth= date_of_birth.toString().split('T')[0]
  console.log([first_name, last_name, address, phone, id, city_of_birth,date_of_birth, zip_code, ])
  const sql = `INSERT INTO user_profile (first_name, last_name,address,phone,id_user,
      city_of_birth,date_of_birth,zip_code) VALUES(?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE 
      first_name = Values(first_name),
      last_name = Values(last_name),
      address= Values(address),
      phone = values(phone),
      city_of_birth = values(city_of_birth)
      ,date_of_birth = values(date_of_birth)
	    ,zip_code=values(zip_code)`;

  mysql.execute(
    sql,
    [first_name, last_name, address, phone, id, city_of_birth,date_of_birth, zip_code],
    sqlexec(res, mysql)
  );
});

router.put("/", auth([]), (req, res) => {
  const { first_name, last_name, address, phone, city_of_birth } = req.body;
  const { id } = req.user;
  //   const { id } = req.params;
  const sql = `UPDATE  user_profile SET first_name=?, last_name=?, WHERE id_user=? `;

  mysql.execute(sql, [first_name, last_name, id_user], sqlexec(res, mysql));
});

router.patch("/changeavatar", auth([]),upload.single('image'),(req, res) => {
  const image = dir + req.file.filename;
  const { id } = req.user;

  const sql = `UPDATE user_profile SET avatar=? WHERE id_user=? `;

  mysql.execute(sql, [image, id], sqlexec(res, mysql));
});



// router.delete("/", auth([]), (req, res) => {
//   const { id } = req.params;
//   const sql = `DELETE FROM category  WHERE id=? `;

//   mysql.execute(sql, [id], sqlexec(res, mysql));
// });

module.exports = router;
