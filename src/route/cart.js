const router = require("express").Router();
const mysql = require("../dbconfig");
const { auth } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");

// bikin checkout

router.get("/", auth([]), (req, res) => {
  const { id } = req.user;
  const sql = `SELECT cart.id, item.name, item.price, item.image, item.rating, cart.qty
    ,(cart.qty * item.price) AS \`total harga\`
    FROM cart JOIN item on cart.id_item=item.id WHERE cart.id_user=?`;
  mysql.execute(sql, [id], sqlexec(res, mysql));
});

router.post("/", auth(['customer']), (req, res) => {
  const id_user = req.user.id;
  // const { id_item, qty } = req.body;
  // const id = id_user.toString() + id_item.toString()
  const sql = `INSERT INTO checkout (id_user) VALUES (?)`;

  mysql.execute(sql, [id_user], sqlexec(res, mysql));
});

router.post("/", auth(['customer']), (req, res) => {
  const id_user = req.user.id;
  const { id_item, qty } = req.body;
  const id = id_user.toString() + id_item.toString()
  const sql = `INSERT INTO cart (id,id_user, id_item,qty) VALUES ( ?,?,?,?)
          ON DUPLICATE KEY UPDATE qty = Values(qty)`;

  mysql.execute(sql, [id, id_user, id_item, qty], sqlexec(res, mysql));
});

router.put("/changeitemqty/:id", auth(['customer']), (req, res) => {
  const id_user = req.user.id;
  const id_item = req.params.id;
  const id = id_user.toString() + id_item.toString()
  const { qty } = req.body;
  const sql = "UPDATE cart SET qty=? WHERE id=?";

  mysql.execute(sql, [qty, id, id_user], sqlexec(res, mysql));
});

router.delete("/cleanmycart", auth(['customer']), (req, res) => {
  const id_user = req.user.id;
  const sql ="DELETE FROM cart where id_user=?";

  mysql.execute(sql, [id,id_user], sqlexec(res, mysql));
});

router.delete("/:id", auth(['customer']), (req, res) => {
  const id = req.params.id;
  const id_user = req.user.id;
  const sql ="DELETE FROM cart where id=? AND id_user=?";

  mysql.execute(sql, [id,id_user], sqlexec(res, mysql));
});

module.exports = router;
