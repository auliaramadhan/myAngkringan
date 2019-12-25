const router = require("express").Router();
const mysql = require("../dbconfig");
const { auth } = require("../middleware/auth");
const { sqlexec} = require("../middleware/mysql");

router.get('/:id_item', auth, )


module.exports = router