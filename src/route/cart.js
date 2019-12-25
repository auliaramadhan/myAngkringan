const router = require("express").Router();
const mysql = require("../dbconfig");
const { auth } = require("../middleware/auth");
const { sqlexec} = require("../middleware/mysql");

router.get('/', auth, (req, res) => {
   const {id} = req.user
   const sql = `SELECT (cart.id, item.name, item.price, item.image, item.rating)
    FROM cart JOIN item on cart.id_item=item.id WHERE cart.id_user=?`
   mysql.execute(sql,[id], sqlexec(res,mysql))
})

router.post('/putitemtocart', auth, (req,res) =>{
   if (req.user.roles !== 'customer') {
      re.send({success:false, msg:'langsung ambil aja di toko'})
   }
   const id_user = req.user.id
   const {id_item, qty} = req.body

   const sql = "INSERT INTO cart (id_user, id_item,qty) VALUES (?,?,?)"

   mysql.execute(sql, [id_user, id_item, qty], sqlexec(res,mysql))

})

router.put('/changeitemqty/:id', auth, (req,res) =>{
   if (req.user.roles !== 'customer') {
      re.send({success:false, msg:'langsung ambil aja di toko'})
   }
   const id_user = req.user.id
   const id = req.params.id
   const {qty} = req.body

   const sql = "UPDATE cart SET qty=? WHERE id=? AND id_user=?"

   mysql.execute(sql, [qty,id, id_user], sqlexec(res,mysql))
})

router.delete('/removefromcart/:id', auth, (req,res) =>{
   if (req.user.roles !== 'customer') {
      re.send({success:false, msg:'langsung ambil aja di toko'})
   }
   const id = req.params.id

   const sql = "DELETE cart where id=?"

   mysql.execute(sql, [id], sqlexec(res,mysql))
})

module.exports = router
