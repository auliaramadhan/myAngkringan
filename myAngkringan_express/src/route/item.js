"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
var express_1 = require("express");
var dbconfig_1 = __importDefault(require("../dbconfig"));
var auth_1 = require("../middleware/auth");
var mysql_1 = require("../middleware/mysql");
var multer_1 = __importDefault(require("multer"));
var router = express_1.Router();
var dir = "/images/uploads/item/";
var fileFilter = function (req, file, callback) {
    var ext = file.originalname.split(".").pop();
    if (ext !== "png" && ext !== "jpg" && ext !== "gif" && ext !== "jpeg") {
        return callback("Only images are allowed");
    }
    callback(null, true);
};
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public' + dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".jpg");
    }
});
var upload = multer_1.default({ storage: storage, fileFilter: fileFilter });
router.get(["", "/search"], function (req, res) {
    var _a = req.query, page = _a.page, order = _a.order, name = _a.name, price = _a.price, category = _a.category, rating = _a.rating, limit = _a.limit, byRestaurant = _a.byRestaurant, asc = _a.asc;
    name = name ? " item.name LIKE \"%" + name + "%\" " : "item.name LIKE \"%%\"";
    price = price ? " AND item.price= \"" + price + "\"" : "";
    rating = rating ? " AND item.rating=ROUND(" + rating + ",0) " : "";
    byRestaurant = byRestaurant ? " AND id_restaurant=" + byRestaurant + " " : "";
    order = order ? "item." + order : "restaurant.id";
    var where = name || price || rating ? "WHERE" : "";
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    asc = asc || "DESC";
    // "SELECT * FROM item WHERE id_restaurant=?";
    var sql = "(SELECT item.id,item.name , item.price, item.image, item.rating, \n    item.created_on, item.updated_on, restaurant.name AS restauran\n  FROM item JOIN restaurant on item.id_restaurant=restaurant.id \n  " + where + " " + name + " " + price + " " + rating + " " + byRestaurant + "\n  ORDER BY " + order + " " + asc + " LIMIT " + limit + " OFFSET " + (page * limit - limit) + ")\n  union (select count(*),null,null,null,null,null,null,null,null from item \n  " + where + " " + name + " " + price + " " + rating + " " + byRestaurant + ")";
    var pagequery = {
        current_page: page,
        limit: limit,
        link: req.get('host') + req.path, query: req.query
    };
    dbconfig_1.default.execute(sql, [], mysql_1.sqlexecData(res, dbconfig_1.default, pagequery));
});
router.get("/:id_item", function (req, res) {
    var id_item = req.params.id_item;
    var sql = "SELECT  * FROM item where WHERE id=?";
    // `SELECT * FROM item WHERE id_restaurant=?
    // ORDER BY ${order} LIMIT 10 OFFSET ${page*10-10}`;
    dbconfig_1.default.execute(sql, [id_item], mysql_1.sqlexecData(res, dbconfig_1.default));
});
router.get("/recommmended/:id_item", function (req, res) {
    var id_item = req.params.id_item;
    var sql = "SELECT  * FROM item where id<>?\n    id_category=(SELECT id_category from item WHERE id=?) \n    and id_restaurant=(SELECT id_restaurant from item WHERE id=?)\n      order by desc limit 5";
    // order by id=? desc, price desc limit 6`;
    // `SELECT * FROM item WHERE id_restaurant=?
    // ORDER BY ${order} LIMIT 10 OFFSET ${page*10-10}`;
    dbconfig_1.default.execute(sql, [id_item, id_item, id_item], mysql_1.sqlexecData(res, dbconfig_1.default));
});
// router.post("/additem", auth('manager'), upload.single("image"), (req, res) => {
router.post("/", auth_1.auth(["manager"]), upload.single("image"), function (req, res) {
    var image = dir + req.file.filename;
    var id_restaurant = (req.user.id_restaurant ? req.user : req.body).id_restaurant;
    var _a = req.body, name = _a.name, price = _a.price, id_category = _a.id_category;
    var sql = "INSERT INTO item (name, price, image, id_restaurant, id_category) VALUES (?,?,?,?,?)";
    try {
        dbconfig_1.default.execute(sql, [name, price, image, id_restaurant, id_category], mysql_1.sqlexec(res, dbconfig_1.default));
    }
    catch (error) {
        res.send({ success: false, msg: error });
    }
});
router.put("/:id", auth_1.auth(["manager", "admin"]), upload.single("image"), function (req, res) {
    var image = dir + req.file.filename;
    /*nanti ditambah buat gambar lama

   */
    var id = req.params.id;
    var _a = req.body, name = _a.name, price = _a.price, id_category = _a.id_category;
    var id_restaurant = (req.user.id_restaurant ? req.user : req.body).id_restaurant;
    // const sql = "UPDATE item SET name=?, price=?, image=?, id_category=? WHERE id=?";
    var sql = "UPDATE item SET name=?, price=?, image=?, id_category=? WHERE id=? AND id_restaurant=?";
    try {
        dbconfig_1.default.execute(sql, [name, price, image, id_category, id, id_restaurant], mysql_1.sqlexec(res, dbconfig_1.default));
    }
    catch (error) {
        res.send({ success: false, msg: error });
    }
    // mysql.execute(sql, [name, price, image,id_category, id, id_restaurant], sqlexec(res, mysql));
});
router.delete("/:id", auth_1.auth(["manager", "admin"]), function (req, res) {
    var id_restaurant = (req.user.id_restaurant ? req.user : req.body).id_restaurant;
    var id = req.params.id;
    var sql = "DELETE FROM item WHERE id=? AND id_restaurant=?";
    dbconfig_1.default.execute(sql, [id, id_restaurant], mysql_1.sqlexec(res, dbconfig_1.default));
});
exports.default = router;
