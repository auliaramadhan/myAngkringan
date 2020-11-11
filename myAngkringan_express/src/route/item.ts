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
require("dotenv").config();
import { Router, Request, Response, NextFunction } from "express"
import mysql from "../dbconfig"
import { auth } from "../middleware/auth"
import { sqlexec, sqlexecData } from "../middleware/mysql"
import * as multer from "multer"


const router = Router()

const dir = "/images/uploads/item/";

var fileFilter = (req , file, callback) => {
  var ext = file.originalname.split(".").pop();
  if (ext !== "png" && ext !== "jpg" && ext !== "gif" && ext !== "jpeg") {
    return callback("Only images are allowed");
  }
  callback(null, true);
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public' + dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  }
});
const upload  = multer({ storage: storage, fileFilter });

router.get(["", "/search"], (req, res) => {
  let { page, order, name, price, category, rating, limit, byRestaurant, asc } = req.query;

  name = name ? ` item.name LIKE "%${name}%" ` : `item.name LIKE "%%"`;
  price = price ? ` AND item.price= "${price}"` : "";
  rating = rating ? ` AND item.rating=ROUND(${rating},0) ` : "";
  byRestaurant = byRestaurant ? ` AND id_restaurant=${byRestaurant} ` : "";
  order = order ? "item." + order : "restaurant.id";
  let where = name || price || rating ? "WHERE" : "";
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  asc = asc || "DESC";


  // "SELECT * FROM item WHERE id_restaurant=?";
  const sql = `(SELECT item.id,item.name , item.price, item.image, item.rating, 
    item.created_on, item.updated_on, restaurant.name AS restauran
  FROM item JOIN restaurant on item.id_restaurant=restaurant.id 
  ${where} ${name} ${price} ${rating} ${byRestaurant}
  ORDER BY ${order} ${asc} LIMIT ${limit} OFFSET ${page * limit - limit})
  union (select count(*),null,null,null,null,null,null,null,null from item 
  ${where} ${name} ${price} ${rating} ${byRestaurant})`;

  const pagequery = {
    current_page: page, limit,
    link: req.get('host') + req.path, query: req.query
  }

  mysql.execute(sql, [], sqlexecData(res, mysql, pagequery));
});

router.get("/:id_item", (req : Request, res : Response) => {
  const { id_item } = req.params;
  const sql = `SELECT  * FROM item where WHERE id=?`
  // `SELECT * FROM item WHERE id_restaurant=?
  // ORDER BY ${order} LIMIT 10 OFFSET ${page*10-10}`;
  mysql.execute(sql, [id_item], sqlexecData(res, mysql));
});

router.get("/recommmended/:id_item", (req : Request, res : Response) => {
  const { id_item } = req.params;
  const sql = `SELECT  * FROM item where id<>?
    id_category=(SELECT id_category from item WHERE id=?) 
    and id_restaurant=(SELECT id_restaurant from item WHERE id=?)
      order by desc limit 5`;
      // order by id=? desc, price desc limit 6`;
  // `SELECT * FROM item WHERE id_restaurant=?
  // ORDER BY ${order} LIMIT 10 OFFSET ${page*10-10}`;
  mysql.execute(sql, [id_item, id_item, id_item], sqlexecData(res, mysql));
});

// router.post("/additem", auth('manager'), upload.single("image"), (req, res) => {
router.post("/", auth(["manager"]), upload.single("image"), (req : Request, res : Response) => {
  const image = dir + req.file.filename;
  const { id_restaurant } = req.user.id_restaurant ? req.user : req.body;
  const { name, price, id_category } = req.body;

  const sql =
    "INSERT INTO item (name, price, image, id_restaurant, id_category) VALUES (?,?,?,?,?)";

  try {
    mysql.execute(
      sql,
      [name, price, image, id_restaurant, id_category],
      sqlexec(res, mysql)
    );
  } catch (error) {
    res.send({ success: false, msg: error });
  }

});

router.put(
  "/:id",
  auth(["manager", "admin"]),
  upload.single("image"),
  (req, res) => {
    const image = dir + req.file.filename;
    /*nanti ditambah buat gambar lama

   */
    const { id } = req.params;
    const { name, price, id_category } = req.body;
    const { id_restaurant } = req.user.id_restaurant ? req.user : req.body;


    // const sql = "UPDATE item SET name=?, price=?, image=?, id_category=? WHERE id=?";
    const sql = "UPDATE item SET name=?, price=?, image=?, id_category=? WHERE id=? AND id_restaurant=?";

    try {
      mysql.execute(sql, [name, price, image, id_category, id, id_restaurant],
        sqlexec(res, mysql)
      );
    } catch (error) {
      res.send({ success: false, msg: error });
    }


    // mysql.execute(sql, [name, price, image,id_category, id, id_restaurant], sqlexec(res, mysql));
  }
);

router.delete("/:id", auth(["manager", "admin"]), (req, res) => {
  const { id_restaurant } = req.user.id_restaurant ? req.user : req.body;
  const { id } = req.params;
  const sql = `DELETE FROM item WHERE id=? AND id_restaurant=?`;

  mysql.execute(sql, [id, id_restaurant], sqlexec(res, mysql));
});

export default router 
