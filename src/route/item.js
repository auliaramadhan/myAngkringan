require("dotenv").config();
const router = require("express").Router();
const mysql = require("../dbconfig");
const fs = require("fs");
const url = require("url");
const { auth } = require("../middleware/auth");
const { sqlexec, sqlexecData } = require("../middleware/mysql");


const dir = "public/images/uploads/item/";

var multer = require("multer");
var fileFilter = (req, file, callback) => {
  var ext = file.originalname.split('.').pop();
  if(ext !== 'png' && ext !== 'jpg' && ext !== 'gif' && ext !== 'jpeg') {
      return callback('Only images are allowed')
  }
  callback(null, true)
}

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now()+".jpg");
  }
});
var upload = multer({ storage: storage , fileFilter});

// router.get("", (req, res) => {
//   let { page, order,limit } = req.query;
//  
//   // order = order ? "item." + order :  "restaurant.id" ;
//   // page = page || 1;
//   // limit = limit || 10;
//   res.redirect(url.format({
//     pathname:'/search'
//     , query:{...req.query}
//   }))

//   // const sql = `SELECT item.id,item.name, item.price, item.image, item.rating, 
//   //     item.created_on, item.updated_on, restaurant.name , COUNT(*) AS "total_data"
//   //   FROM item JOIN restaurant on item.id_restaurant=restaurant.id
//   //   ORDER BY ${order} LIMIT ${limit} OFFSET ${page*limit-limit} `;
//   //   /
//   //   mysql.execute(sql, [], sqlexecData(res, mysql,{page, limit}));
//   });
  

router.get(['',"/search"], (req, res) => {
  let { page, order, name, price, rating, limit, byRestaurant} = req.query;
 
  name = name ? ` item.name LIKE "%${name}%" ` : `item.name LIKE "%%"`;
  price = price ? ` AND item.price= "${price}"` : "";
  rating = rating ?  ` AND item.rating=ROUND(${rating},0) ` : "";
  byRestaurant = byRestaurant?  ` AND id_restaurant=${byRestaurant} ` : "";
  order = order ? "item." + order : "restaurant.id";
  // const AND = condition => (condition ? "" : "");
  let where = name || price || rating ? "WHERE" : "";
  page = parseInt(page) || 1
  limit = parseInt(limit) || 10;

  // "SELECT * FROM item WHERE id_restaurant=?";
  const sql = 
  `(SELECT item.id,item.name , item.price, item.image, item.rating, 
    item.created_on, item.updated_on, restaurant.name AS restauran, category.name as category
  FROM item JOIN restaurant on item.id_restaurant=restaurant.id 
  LEFT OUTER JOIN category on category.id=item.id_category
  ${where} ${name} ${price} ${rating} ${byRestaurant}
  ORDER BY ${order} LIMIT ${limit + 1} OFFSET ${page * limit - limit} )
  union (select count(*),null,null,null,null,null,null,null,null from item 
  ${where} ${name} ${price} ${rating} ${byRestaurant})`;

 

  mysql.execute(sql, [], sqlexecData(res, mysql,{page,limit}));
}); 

router.get("/:id_item", (req, res) => {
  const { id_item } = req.params;
  const sql = `SELECT  * FROM item where id_category=(SELECT id_category from item WHERE id=?) 
  and id_restaurant=(SELECT id_restaurant from item WHERE id=?)
      order by id=? desc, price desc limit 6`
  // `SELECT * FROM item WHERE id_restaurant=? 
  // ORDER BY ${order} LIMIT 10 OFFSET ${page*10-10}`;
  mysql.execute(sql, [id_item, id_item, id_item], sqlexecData(res, mysql));
});


// router.post("/additem", auth('manager'), upload.single("image"), (req, res) => {
router.post("/", auth(['manager']), upload.single("image"), (req, res) => {
  const image = dir + req.file.filename +".jpg";
  const { id_restaurant } = req.user.id_restaurant? req.user:req.body;
  const { name, price , id_category} = req.body;
  
 
  const sql =
    "INSERT INTO item (name, price, image, id_restaurant, id_category) VALUES (?,?,?,?,?)";

  mysql.execute(sql, [name, price, image, id_restaurant, id_category], sqlexec(res, mysql));
});

router.put("/:id", auth(['manager', 'admin']), upload.single("image"), (req, res) => {
 

  const image = dir + req.file.filename;
  /*nanti ditambah buat gambar lama

   */
  const {id}= req.params;
  const { name, price,id_category } = req.body;
  const { id_restaurant } = req.user.id_restaurant? req.user:req.body;

  const sql = "UPDATE item SET name=?, price=?, image=?, id_category=? WHERE id=?";
  // const sql = "UPDATE item SET name=?, price=?, image=?, id_category=? WHERE id=? AND id_restaurant=?";

  mysql.execute(sql, [name, price, image,id_category, id], sqlexec(res, mysql));
  // mysql.execute(sql, [name, price, image,id_category, id, id_restaurant], sqlexec(res, mysql));
});

router.delete("/:id", auth(['manager', 'admin']), (req, res) => {
 

  const { id_restaurant } = req.user.id_restaurant? req.user:req.body;
  const {id}  = req.params;
  const sql = `DELETE FROM item WHERE id=? AND id_restaurant=?`;

  mysql.execute(sql, [id,id_restaurant], sqlexec(res, mysql));
});

module.exports = router;
