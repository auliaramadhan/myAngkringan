require("dotenv").config();
const router = require("express").Router();
const mysql = require("../dbconfig");
const { auth } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");

router.get("",auth([]),  (req, res) => {
  const { id } = req.user;
  const sql = `SELECT * FROM user_profile where id_user=?`;

  mysql.execute(sql, [id], sqlexec(res, mysql));
});

router.post("/", auth([]), (req, res) => {
  const { first_name, last_name, address, phone, city_of_birth, date_of_birth } = req.body;
  const { id } = req.user;
  const sql = `INSERT INTO user_profile (first_name, last_name,address,phone,id_user,
      city_of_birth) VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE 
      first_name = Values(first_name),
      last_name = Values(last_name),
      address= Values(address),
      phone = values(phone),
      city_of_birth = values(city_of_birth)`
      // ,date_of_birth = values(date_of_birth)`;

  mysql.execute(
    sql,
    [first_name, last_name, address, phone, id, city_of_birth],
    sqlexec(res, mysql)
  );
});

router.put("/", auth([]), (req, res) => {
  const { first_name, last_name, address, phone, city_of_birth } = req.body;
  const { id_user } = req.user;
  //   const { id } = req.params;
  const sql = `UPDATE  user_profile SET first_name=?, last_name=?, WHERE id_user=? `;

  mysql.execute(sql, [first_name, last_name, id_user], sqlexec(res, mysql));
});
// router.delete("/", auth([]), (req, res) => {
//   const { id } = req.params;
//   const sql = `DELETE FROM category  WHERE id=? `;

//   mysql.execute(sql, [id], sqlexec(res, mysql));
// });

module.exports = router;
