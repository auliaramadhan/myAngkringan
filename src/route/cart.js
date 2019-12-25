const router = require("express").Router();
const mysql = require("../dbconfig");
const { auth } = require("../middleware/auth");
const { sqlexec } = require("../middleware/mysql");

router.get('/', auth, (req, res) => {
   const {id} = req.user
   const sql = "SELECT * FROM cart JOIN item where cart.id_item=item.id AND cart.id_user=?"
   mysql.execute(sql,[id], sqlexec)
})

router.post('/putitemtocart', auth, (req,res) =>{
   if (req.user.roles !== 'customer') {
      re.send({success:false, msg:'langsung ambil aja di toko'})
   }
   const id_user = req.user.id
   const {id_item, qty} = req.body

   const sql = "INSERT INTO cart (id_user, id_item,qty) VALUES (?,?,?)"

   mysql.execute(sql, [id_user, id_item, qty], sqlexec)

})

router.delete('/removefromcart/:id', auth, (req,res) =>{
   if (req.user.roles !== 'customer') {
      re.send({success:false, msg:'langsung ambil aja di toko'})
   }
   const id = req.params.id
   // const id_user = req.user.id
   // const {id_item, qty} = req.body

   const sql = "DELETE cart where id=?"

   mysql.execute(sql, [id_user, id_item, qty], sqlexec)
})
