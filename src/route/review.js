const router = require("express").Router();
const mysql = require("../dbconfig");
const { auth } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");

router.get("/myreview", auth, (req, res) => {
  if (req.user.roles !== "customer") {
    res.send({ success: false, msg: "yee mau review barang sendiri" });
    return;
  }
  const id_user = req.user.id;

  const sql =
    "SELECT * FROM review JOIN user ON review.id_user=user.id WHERE review.id_user=?";

  mysql.execute(sql, [id_user], sqlexec(res, mysql));
});

router.get("/:id_item", auth, (req, res) => {
  const { id_item } = req.params;

  const sql =
    "SELECT * FROM review JOIN user ON review.id_user=user.id WHERE review.id_item=?";

  mysql.execute(sql, [id_item], sqlexec(res, mysql));
});

router.post("/addreview/:id_item", auth, (req, res) => {
  if (req.user.roles !== "customer") {
    res.send({ success: false, msg: "yee mau review barang sendiri" });
    return;
  }
  const id_user = req.user.id;
  const { id_item } = req.params;
  const { review, rating } = req.body;
  console.log([review, rating, id_item, id_user])

  const sql = `INSERT INTO review (review, rating,id_item,id_user)
   VALUES (?,?,?,?)`;

  mysql.execute(sql, [review, rating, id_item, id_user], sqlexec(res, mysql));
  // const sql_update_rating = `UPDATE item SET avgrating=_avgrating FROM
  // (SELECT id_item , AVG(rating) AS _avgrating FROM review GROUP BY id_item )
  // A WHERE A.ID = Table_01.ID `
  //   mysql.execute(sql, [review, rating, id_item, id_user], sqlexec(res, mysql));
});

router.put("/changereview/:id_item", auth, (req, res) => {
  if (req.user.roles !== "customer") {
    res.send({ success: false, msg: "yee mau review barang sendiri" });
    return;
  }
  const id_user = req.user.id;
  const { id_item } = req.params;
  const { review, rating } = req.body;

  const sql = `UPDATE review SET review=?, rating=? where id_item=? AND id_user=?`;

  mysql.execute(sql, [review, rating, id_item, id_user], sqlexec(res, mysql));
});

module.exports = router;
