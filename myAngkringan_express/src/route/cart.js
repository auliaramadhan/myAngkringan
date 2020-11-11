/**
 *@swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the book.
 *         title:
 *           type: string
 *           description: The title of your book.
 *         author:
 *           type: string
 *           description: Who wrote the book?
 *         finished:
 *           type: boolean
 *           description: Have you finished reading it?
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date of the record creation.
 *       example:
 *          title: The Pragmatic Programmer
 *          author: Andy Hunt / Dave Thomas
 *          finished: true
 */

const router = require("express").Router();
const mysql = require("../dbconfig");
const { auth } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");

// bikin checkout

router.get("/", auth([]), (req, res) => {
  const { id } = req.user;
  const sql = `SELECT cart.id, item.name, item.price, item.image,
   item.rating, cart.qty,cart.total, item.id as id_item, item.image
    FROM cart Left JOIN item on cart.id_item=item.id WHERE cart.id_user=?`;
  mysql.execute(sql, [id], sqlexec(res, mysql));
});

// router.post("/", auth(['customer']), (req, res) => {
//   const id_user = req.user.id;
//   // const { id_item, qty } = req.body;
//   // const id = id_user.toString() + id_item.toString()
//   const sql = `INSERT INTO checkout (id_user) VALUES (?)`;

//   mysql.execute(sql, [id_user], sqlexec(res, mysql));
// });

router.post("/", auth(['customer']), (req, res) => {
  const id_user = req.user.id;
  const { id_item, qty, total } = req.body;
  const id = id_user.toString() + id_item.toString()
  const sql = `INSERT INTO cart (id,id_user, id_item,qty, total) 
          VALUES ( ?,?,?,?,?)
          ON DUPLICATE KEY UPDATE qty = Values(qty),
          total = VALUES(total)`;
          // *(select price from item where id=?)

          // INSERT INTO `cart`(`id`, `id_user`, `id_item`, `qty`, `total`) VALUES (200, 11,8, 5,(select 5*price from item where id=8))
  mysql.execute(sql, [id, id_user, id_item, qty, total], sqlexec(res, mysql));
});


router.post("/addcarts", auth(['customer']), (req, res) => {
  const id_user = req.user.id;
  const { id_item, qty } = req.body;
  const id = id_user.toString() + id_item.toString()
  const datas = req.body.map((v) => {
    const arrayTemp = new Array(5).fill("NULL")
    arrayTemp[0] = v.id
    arrayTemp[3] = v.qty
  })

  mysql.execute(sql, datas, sqlexec(res, mysql));
});

router.put("/changeitemqty/", auth(['customer']), (req, res) => {
  // const id_user = req.user.id;
  // const id_item = req.params.id;
  const { qty,id, total } = req.body;
  // const id = req.body || id_user.toString() + id_item.toString()
  // const sql = "UPDATE cart SET qty=? WHERE id=?";
  // const sql = "UPDATE cart SET qty=?, total=qty*(SELECT price FROM item where id=id_item) WHERE id=?";
  const sql = "UPDATE cart SET qty=?, total=? WHERE id=?";

  mysql.execute(sql, [qty,total, id], sqlexec(res, mysql));
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
