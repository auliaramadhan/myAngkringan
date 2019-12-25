const router = require("express").Router();
const mysql = require("../dbconfig");
const { auth } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");

router.get("/:id_item", auth, (req, res) => {
  const { id_item } = req.params;

  const sql =
    "SELECT * FROM review JOIN user ON review.id_user=user.id WHERE review.id_item=?";

  mysql.execute(sql, [id_item], sqlexec(res, mysql));
});
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

router.post("/addreview/:id_item", auth, (req, res) => {
  if (req.user.roles !== "customer") {
    res.send({ success: false, msg: "yee mau review barang sendiri" });
    return;
  }
  const id_user = req.user.id;
  const { id_item } = req.params;
  const { review, rating } = req.params;

  const sql = `INSERT INTO review (review, rating,id_item,id_user)
   VALUES (?,?,?,?)`;

  mysql.execute(sql, [review, rating, id_item, id_user], sqlexec(res, mysql));
});

module.exports = router;
