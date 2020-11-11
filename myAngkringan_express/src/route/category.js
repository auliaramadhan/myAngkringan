require("dotenv").config();
const router = require("express").Router();
const mysql = require("../dbconfig");
const { auth } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");

router.get("", (req, res) => {
  const sql = `SELECT * FROM category `;

  mysql.execute(sql, [], sqlexec(res, mysql));
});

router.post("", auth(["admin"]), (req, res) => {
  const { name, description } = req.body;
  const sql = `INSERT INTO category (name, description) VALUES(?,?) `;

  mysql.execute(sql, [name, description], sqlexec(res, mysql));
});
router.put("/:id", auth(["admin"]), (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;
  const sql =`UPDATE category SET name=?, description=? WHERE id=? `;

  mysql.execute(sql, [name, description, id], sqlexec(res, mysql));
});
router.delete("/:id", auth(["admin"]), (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM category  WHERE id=? `;
  
  mysql.execute(sql, [id], sqlexec(res, mysql));
});

module.exports = router;
