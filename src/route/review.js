const router = require("express").Router();
const mysql = require("../dbconfig");
const { auth } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");

router.get("/myreview", auth('customer'), (req, res) => {
  const id_user = req.user.id;
  const sql ="SELECT * FROM review JOIN user ON review.id_user=user.id WHERE review.id_user=?";
  mysql.execute(sql, [id_user], sqlexec(res, mysql));
});

router.get("/:id_item", auth(), (req, res) => {
  const { id_item } = req.params;
  const sql =
    "SELECT * FROM review JOIN user ON review.id_user=user.id WHERE review.id_item=?";
  mysql.execute(sql, [id_item], sqlexec(res, mysql));
});

router.post("/addreview/:id_item", auth('customer'), (req, res) => {
  const id_user = req.user.id;
  const { id_item } = req.params;
  const { review, rating } = req.body;
  console.log([review, rating, id_item, id_user]);

  const sql = `INSERT INTO review (review, rating,id_item,id_user)
   VALUES (?,?,?,?)`;

  mysql.execute(sql, [review, rating, id_item, id_user], sqlexec(res, mysql));
  const sqlupdate = `UPDATE item SET item.rating = 
                  (SELECT AVG(rating) FROM review
                         WHERE review.id_item = ?)`;

  mysql.execute(sqlupdate, [id_item],
     (err,result,field) => !err? console.log(result): console.log(err));
});

router.put("/changereview/:id_item", auth('customer'), (req, res) => {
  const id_user = req.user.id;
  const { id_item } = req.params;
  const { review, rating } = req.body;

  const sql = `UPDATE review SET review=?, rating=? where id_item=? AND id_user=?`;

  mysql.execute(sql, [review, rating, id_item, id_user], sqlexec(res, mysql));

  const sqlupdate = `UPDATE item SET item.rating = 
                  (SELECT AVG(rating) FROM review
                         WHERE review.id_item = ?)`;

  mysql.execute(sqlupdate, [id_item],
     (err,result,field) => !err? console.log(result): console.log(err));
});

module.exports = router;
