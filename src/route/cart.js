const router = require("express").Router();
const mysql = require("../dbconfig");
const { auth } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");

router.get('/', auth, (req, res) => {
   const {id} = req.user
   const sql = "SELECT * FROM cart JOIN item where cart.id_item=item.id AND cart.id_user=?"
   mysql.execute(sql,[id], sqlexec)
})

router.post('/putitem', auth, (req,res) =>{
   const id_user = req.user.id
   const {id_item} = req.body

   const sql = "INSERT INTO cart (id_user, id_item) VALUES (?,?)"



})

