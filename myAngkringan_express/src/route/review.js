const router = require("express").Router();
const mysql = require("../dbconfig");
const { auth } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");

router.get("/myreview", auth(['customer']), (req, res) => {
  const id_user = req.user.id;
  const sql ="SELECT * FROM review WHERE id_user=?";
  mysql.execute(sql, [id_user], sqlexec(res, mysql));
});

router.get("/:id_item", (req, res) => { 
  console.log(req.user)
  const { id_item } = req.params;
  const sql =
    `SELECT user_profile.*, review.* FROM review Left JOIN user_profile 
     on user_profile.id_user=review.id_user
     WHERE review.id_item=? ORDER BY review.updated_on desc`;
     console.log(sql)
  mysql.execute(sql, [id_item], sqlexec(res, mysql));
});

router.post("/", auth(['customer']), (req, res) => {
  const id_user = req.user.id;
  const { review, rating, id_item } = req.body;
  const id = id_user.toString() + id_item.toString()
 

  const sql = `INSERT INTO review (id, review, rating,id_item,id_user)
   VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE
   review = VALUES(review), rating= VALUES(rating)`;

  mysql.execute(sql, [id, review, rating, id_item, id_user], sqlexec(res, mysql));
});

router.post("/:id_item", auth(['customer']), (req, res) => {
  const id_user = req.user.id;
  const {id_item} = req.params;
  const { review, rating } = req.body;
  const id = id_user.toString() + id_item.toString()
  

  const sql = `INSERT INTO review (id,review, rating,id_item,id_user)
   VALUES (?,?,?,?,?)`;

  mysql.execute(sql, [id, review, rating, id_item, id_user], sqlexec(res, mysql));
});

router.put("/:id", auth(['customer']), (req, res) => {
  const id_user = req.user.id;
  const { id} = req.params;
  const { review, rating } = req.body;

  const sql = `UPDATE review SET review=?, rating=? where id=? AND id_user=?`;
  mysql.execute(sql, [review, rating, id, id_user], sqlexec(res, mysql));
});

router.delete("/:id", auth(['customer']), (req, res) => {
  const id_user = req.user.id;
  const { id } = req.params;

  const sql = `DELETE FROM review WHERE id=? AND id_user=?`;

  mysql.execute(sql, [id, id_user], sqlexec(res, mysql));

  // const sqlupdate = `UPDATE item SET item.rating = (SELECT AVG(rating) FROM review
  //                        WHERE review.id_item = ?)`;

  // mysql.execute(sqlupdate, [id_item],
  //    (err,result,field) => !err?
});

module.exports = router;
