require("dotenv").config();
const router = require("express").Router();
const mysql = require("../dbconfig");
const { auth } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");

router.get("/",auth(["customer"]), (req, res) => {
   const {id} = req.user
  const sql = `SELECT * FROM checkout where id_user=?`;

  mysql.execute(sql, [id], sqlexec(res, mysql));
});

router.get("/detail/:id",auth(["customer"]), (req, res) => {
  const {id} = req.params
  const sql = `SELECT * FROM checkout_detail where id_checkout=?`;

  
  mysql.execute(sql, [id], sqlexec(res, mysql));
});

router.post("/", auth(["customer"]), (req, res) => {
   const {id} = req.user
  const { first_name,last_name,phone,address, total_harga  } = req.body;
  const sql = `INSERT INTO checkout 
  (first_name, last_name, phone, address, id_user, total_harga)
  VALUES (?,?,?,?,?,?) `;
  //  VALUES (?,?,?,?,?,select sum(total) from cart where id_user="${id}") `;

  mysql.execute(sql, [first_name, last_name, phone, address, id, total_harga], sqlexec(res, mysql));
});

module.exports = router